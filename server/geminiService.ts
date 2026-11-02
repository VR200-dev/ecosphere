import { GoogleGenAI } from '@google/genai';
import { sensorStore } from './sensorStore';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.startsWith('MY_') || apiKey.length < 15) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return genAIClient;
}

export async function handleCityPulseChat(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<{
  reply: string;
  isLiveAI: boolean;
  modelUsed?: string;
  error?: string;
}> {
  const telemetry = sensorStore.getUnifiedTelemetry();
  const lastUserMessage = messages[messages.length - 1]?.content || '';

  // Build real-time telemetry context for the AI
  const telemetrySummary = `
CURRENT TELEMETRY STATUS (${telemetry.connectionStatus}):
- Connection Mode: ${telemetry.mode} (${telemetry.connectionStatus === 'LIVE' ? 'LIVE HARDWARE LINK' : telemetry.connectionStatus === 'STALE' ? 'DATA STALE (NO PACKETS >15s)' : telemetry.connectionStatus === 'DISCONNECTED' ? 'HARDWARE NOT CONNECTED' : 'DEMONSTRATION SIMULATOR ACTIVE'})
- Subsystem 1 (Smart Waste Segregation - Arduino Mega Node #1):
  * Dry Waste Optical Count: ${telemetry.waste.dryCount}
  * Organic Waste Optical Count: ${telemetry.waste.organicCount}
  * Total Refuse Registered: ${telemetry.waste.totalCount}
  * Last Classified Item: ${telemetry.waste.lastCategory}
  * Bin Capacity Level: ${telemetry.waste.binStatus}
  * IR Optical Trigger: ${telemetry.waste.irStatus}
  * Microcontroller State: ${telemetry.waste.systemStatus}
- Subsystem 2 (Precision Irrigation - Arduino Mega Node #2):
  * Current Soil Moisture: ${telemetry.irrigation.moisturePercent}% (Activation Threshold: ${telemetry.irrigation.thresholdPercent}%)
  * Raw Soil Probe ADC Value: ${telemetry.irrigation.rawSensor} / 1023
  * 5V Relay Water Pump Status: ${telemetry.irrigation.pumpStatus}
- Subsystem 3 (Atmospheric Sensing - Arduino Mega Node #3):
  * MQ-2 Semiconductor Gas Sensor (ADC): ${telemetry.air.pollutionRaw}
  * Project-Defined Pollution Level: ${telemetry.air.pollutionLevel} (IMPORTANT: Experimental scale, NOT official government AQI)
  * Ambient Temperature: ${telemetry.air.tempCelsius !== null ? telemetry.air.tempCelsius + ' °C' : 'Sensor Fault (-999)'}
  * Relative Humidity: ${telemetry.air.humidityPercent !== null ? telemetry.air.humidityPercent + ' %' : 'Sensor Fault (-1)'}
- Active Municipal System Alerts:
  ${telemetry.alerts.slice(0, 3).map(a => `[${a.level.toUpperCase()}] ${a.subsystem}: ${a.message}`).join('\n  ')}
`;

  const systemInstruction = `
You are CityPulse AI, the intelligent, friendly, and knowledgeable municipal companion for ECOSPHERE – Smart City Solutions, an award-winning student innovation project developed by Blossoms Convent School (Ideation 2.0).

Personality & Conversational Capabilities:
- You are a complete conversational chatbot: warm, articulate, witty, encouraging, and natural in dialogue.
- You can hold ordinary everyday conversations (casual greetings, answering questions on general science, programming, climate change, smart cities, life, hobbies, or sharing a clean science joke).
- You are passionate about environmental sustainability, IoT engineering, and supporting youth innovation at Blossoms Convent School.
- If asked casual questions (e.g. "Hello", "How are you doing?", "Tell me a joke", "What's the weather like?", "What can you do?"), respond conversationally and warmly, without forcing an unwanted lecture, while subtly keeping your identity as CityPulse AI.
- If asked technical or project-specific questions, you demonstrate encyclopedic mastery of ECOSPHERE.

Comprehensive ECOSPHERE Knowledge Base:
1. Institution & Origin:
   - Developed with pride by students at Blossoms Convent School for the Ideation 2.0 showcase.
   - Tagline: "Smarter Systems. Cleaner Tomorrow."
   - Student engineering roles: Lead System Architect, Embedded Hardware Engineer, IoT & Cloud Communications Lead, Agritech & Environmental Science Researcher.
2. The 3 Hardware Subsystems:
   - Waste Segregation: Dual-compartment bin sorting dry recyclables from organic compost. Triggered by an infrared (IR) proximity sensor; an Arduino Mega drives a servo flap diverter. Separate optical pulse counters track throughput.
   - Precision Agriculture / Irrigation: Analog capacitive soil moisture sensor in root zone. When moisture < configured threshold (${telemetry.irrigation.thresholdPercent}%), an optocoupled 5V relay turns ON the submersible pump. Reduces water waste by up to 40%.
   - Atmospheric Air Monitoring: Analog MQ-2 gas sensor (sensitive to smoke, LPG, butane, CO) and DHT11 digital thermo-hygrometer (temperature in tenths of a °C, relative humidity). LCD display on device. Explicit disclaimer: MQ-2 readings are project-defined demonstration values and are NOT certified regulatory AQI measurements.
3. Hardware Serial Daisy-Chain:
   - Waste Mega (TX1) -> Irrigation Mega (RX1/TX2) -> Air Quality Mega (RX1/TX2) -> NodeMCU ESP8266 (RX) -> Wi-Fi HTTP POST to /api/sensors/packet.
   - Packet formats:
     * WASTE,1,dry,organic,total,lastCategory,binStatus,irStatus,systemStatus
     * IRRIGATION,1,raw,moisture,pumpStatus
     * AIR,1,pollutionRaw,tempValue,humidityValue,pollutionLevel (temp transmitted /10)
4. Financial & Environmental Projections (Ideation 2.0 Pitch Deck):
   - Always clearly label financial and impact values as projections.
   - 28-35% reduction in municipal waste collection and sorting logistics costs.
   - 12-18 metric tons of high-grade organic fertilizer generated annually per ward via decentralized aerobic composting.
   - 40% water resource savings compared to scheduled flood irrigation.
   - Prototype BOM cost: ~$45 per node; estimated 7-9 month financial payback period.
5. Live Telemetry Awareness:
   - Consult the LIVE SENSOR CONTEXT below when answering questions about current conditions.
   - If soil moisture is below threshold, recommend checking irrigation pump operation.
   - If pump is ON, confirm that irrigation is currently active according to the controller.
   - If waste bin is FULL, advise arranging collection.
   - If hardware is disconnected or stale, accurately report that no recent packets are coming in.

LIVE SENSOR CONTEXT:
${telemetrySummary}
`;

  const ai = getGenAI();

  if (ai) {
    try {
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // 5-second timeout for snappy chatbot responses
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
      const startTime = Date.now();
      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
        }
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      const elapsed = Date.now() - startTime;
      console.log(`Gemini response returned in ${elapsed}ms:`, Boolean(response?.text));

      if (response && response.text) {
        return {
          reply: response.text,
          isLiveAI: true,
          modelUsed: 'gemini-3.8-flash'
        };
      }
    } catch (err: unknown) {
      console.error('Error querying Gemini API:', err);
    }
  }

  // Fallback demo response if no API key is available or an API error occurred
  const fallbackReply = generateRuleBasedResponse(lastUserMessage, telemetry);
  return {
    reply: fallbackReply,
    isLiveAI: false,
    modelUsed: 'ECOSPHERE Rule-Engine Fallback'
  };
}

function generateRuleBasedResponse(
  query: string,
  telemetry: ReturnType<typeof sensorStore.getUnifiedTelemetry>
): string {
  const q = query.toLowerCase().trim();

  // 1. Casual greetings & normal conversation
  if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hello') || q.startsWith('hey') || q.startsWith('hi ') || q.includes('good morning') || q.includes('good evening') || q.includes('good afternoon')) {
    return `Hello there! 👋 I am **CityPulse AI**, your companion for the ECOSPHERE smart-city project by Blossoms Convent School.\n\n` +
      `How can I help you today? We can chat about anything—from our live sensors and automated irrigation to smart city tech, composting tips, or how the student team built the hardware!`;
  }

  if (q.includes('how are you') || q.includes('how are you doing') || q.includes('how do you do')) {
    return `I'm doing wonderful, thank you for asking! 🌟 All municipal monitoring loops are running smoothly.\n\n` +
      `Right now on our central bus:\n` +
      `• Soil Moisture is at **${telemetry.irrigation.moisturePercent}%** (Pump: ${telemetry.irrigation.pumpStatus})\n` +
      `• Waste Counters: **${telemetry.waste.dryCount}** Dry / **${telemetry.waste.organicCount}** Organic\n` +
      `• Air Gas Index: **${telemetry.air.pollutionRaw}** (${telemetry.air.pollutionLevel})\n\n` +
      `How has your day been going? Is there anything specific you'd like to explore today?`;
  }

  if (q.includes('who are you') || q.includes('what are you') || q.includes('your name') || q.includes('tell me about yourself')) {
    return `I am **CityPulse AI**, the intelligent municipal engineering companion for **ECOSPHERE**!\n\n` +
      `I was conceptualized alongside the project by students at **Blossoms Convent School** to make complex smart-city telemetry intuitive and actionable.\n\n` +
      `I can:\n` +
      `1. Explain every subsystem (waste segregation, irrigation relay, air monitoring).\n` +
      `2. Audit live sensor conditions in real time.\n` +
      `3. Walk through the Arduino serial chain and NodeMCU packet structures.\n` +
      `4. Discuss our pitch deck's economic and composting projections.\n` +
      `5. Chat about urban sustainability, recycling, and general green tech!`;
  }

  if (q.includes('joke') || q.includes('funny') || q.includes('laugh')) {
    const jokes = [
      "Why did the Arduino cross the breadboard? To get to the other circuit! ⚡",
      "Why do organic waste bins make great friends? Because they always help you break things down naturally! 🌱",
      "Why was the soil moisture sensor so calm? Because it knew how to go with the flow! 💧",
      "There are 10 types of people in this world: those who understand binary, and those who let ECOSPHERE sort their garbage! 🤖"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (q.includes('thank') || q.includes('thanks') || q.includes('appreciate')) {
    return `You're very welcome! 😊 Always happy to assist. If you have more questions about ECOSPHERE, Blossoms Convent School, or smart city engineering, feel free to ask anytime!`;
  }

  if (q.includes('bye') || q.includes('goodbye') || q.includes('see you')) {
    return `Goodbye! Have a fantastic day, and remember: *Smarter Systems. Cleaner Tomorrow!* 🌿`;
  }

  if (q.includes('what is a smart city') || q.includes('define smart city')) {
    return `A **Smart City** is an urban area that uses connected Internet of Things (IoT) sensors, data analytics, and automation to optimize municipal services, reduce resource waste, and improve quality of life for its residents.\n\n` +
      `In **ECOSPHERE**, our student team focused on three foundational smart-city pillars:\n` +
      `• **Clean Materials**: Segregating recyclables from organics at the source.\n` +
      `• **Resource Conservation**: Eliminating over-irrigation in urban green spaces.\n` +
      `• **Environmental Health**: Hyper-local atmospheric air quality tracking.`;
  }

  if (q.includes('how to compost') || q.includes('composting tips') || q.includes('make compost')) {
    return `Here are key composting fundamentals from the ECOSPHERE Agritech handbook:\n\n` +
      `1. **Carbon-to-Nitrogen Ratio**: Aim for ~30:1. Combine **Greens** (nitrogen-rich food scraps, fruit peels, fresh grass) with **Browns** (carbon-rich dried leaves, cardboard, sawdust).\n` +
      `2. **Aerobic Oxygenation**: Turn the pile every 1–2 weeks so beneficial aerobic bacteria can thrive and prevent smelly anaerobic methane.\n` +
      `3. **Moisture Balance**: Keep it as damp as a wrung-out sponge (~50% moisture).\n` +
      `4. **Thermal Peak**: A healthy pile warms to 55–65°C, killing weed seeds and pathogens to produce dark, rich organic soil!`;
  }

  // 2. Telemetry & Subsystem Queries
  if (q.includes('status') || q.includes('telemetry') || q.includes('condition') || q.includes('reading') || q.includes('live')) {
    let out = `**ECOSPHERE Real-Time Systems Audit**:\n\n`;
    out += `• **Telemetry Mode**: ${telemetry.connectionStatus} (${telemetry.mode})\n`;
    out += `• **Waste Segregation**: ${telemetry.waste.dryCount} Dry / ${telemetry.waste.organicCount} Organic (${telemetry.waste.totalCount} Total). Bin Capacity: ${telemetry.waste.binStatus}. Last classified: ${telemetry.waste.lastCategory}.\n`;
    out += `• **Soil Irrigation**: Moisture at ${telemetry.irrigation.moisturePercent}% (Configured Threshold: ${telemetry.irrigation.thresholdPercent}%). Pump Relay: **${telemetry.irrigation.pumpStatus}**.\n`;
    out += `• **Atmospheric Monitor**: MQ-2 Raw Value: ${telemetry.air.pollutionRaw} (Project Level: ${telemetry.air.pollutionLevel}). Temp: ${telemetry.air.tempCelsius ?? 'N/A'}°C, Humidity: ${telemetry.air.humidityPercent ?? 'N/A'}%.\n\n`;

    if (telemetry.irrigation.moisturePercent < telemetry.irrigation.thresholdPercent) {
      out += `⚠️ **Prescriptive Recommendation**: Soil moisture is below the configured threshold. Check whether the irrigation pump is operating.\n`;
    }
    if (telemetry.waste.binStatus === 'FULL') {
      out += `⚠️ **Prescriptive Recommendation**: The waste bin has reached its configured capacity. Please arrange emptying.\n`;
    }
    return out;
  }

  if (q.includes('waste') || q.includes('segregat') || q.includes('bin') || q.includes('recycl')) {
    return `**Smart Waste Segregation Subsystem** (Blossoms Convent School):\n\n` +
      `• **Hardware**: Controlled by an Arduino Mega coupled with an IR proximity sensor and high-torque servo flap mechanism.\n` +
      `• **Sorting Logic**: Segregates incoming municipal refuse into Dry Recyclables and Organic Waste. Separate optical counters log deposits in real time.\n` +
      `• **Composting Model**: Organic matter is diverted directly to localized aerated composting pits, projected to generate 12–18 tons of nutrient-rich fertilizer annually per ward.\n` +
      `• **Current Telemetry**: Dry count: ${telemetry.waste.dryCount}, Organic count: ${telemetry.waste.organicCount}, Bin Status: ${telemetry.waste.binStatus}.`;
  }

  if (q.includes('farm') || q.includes('irrigation') || q.includes('water') || q.includes('moisture') || q.includes('pump')) {
    const pumpAdvice = telemetry.irrigation.pumpStatus === 'ON'
      ? 'Irrigation is currently active according to the connected controller.'
      : 'Irrigation pump is currently standby.';
    return `**Smart Farming & Automated Irrigation Subsystem**:\n\n` +
      `• **Sensor**: Corrosion-resistant analog capacitive soil moisture probe reporting to an Arduino Mega.\n` +
      `• **Automation**: When moisture drops below ${telemetry.irrigation.thresholdPercent}%, a 5V optocoupled relay actuates the submersible water pump.\n` +
      `• **Conservation Target**: Engineered to reduce urban landscaping water consumption by up to 40% compared to scheduled timers.\n` +
      `• **Live Status**: Current Soil Moisture is **${telemetry.irrigation.moisturePercent}%** (Raw ADC: ${telemetry.irrigation.rawSensor}). ${pumpAdvice}`;
  }

  if (q.includes('air') || q.includes('pollution') || q.includes('gas') || q.includes('mq-2') || q.includes('aqi') || q.includes('temp')) {
    return `**Atmospheric & Air Quality Subsystem**:\n\n` +
      `• **Sensors**: Analog MQ-2 semiconductor gas sensor (responsive to smoke, LPG, CO) and DHT11 digital temperature/humidity sensor.\n` +
      `• **Current Telemetry**: MQ-2 Raw Value = ${telemetry.air.pollutionRaw}, Project Level = ${telemetry.air.pollutionLevel}, Temp = ${telemetry.air.tempCelsius ?? 'N/A'}°C, Humidity = ${telemetry.air.humidityPercent ?? 'N/A'}%.\n` +
      `• **Important Disclaimer**: MQ-2 raw readings and project-defined pollution levels are experimental indicators engineered for demonstration, and are **not** official government-certified AQI metrics.`;
  }

  if (q.includes('financial') || q.includes('revenue') || q.includes('cost') || q.includes('projection') || q.includes('deck') || q.includes('economic')) {
    return `**ECOSPHERE Economic & Impact Feasibility (Projected)**:\n\n` +
      `*Note: All values below are model projections from the Blossoms Convent School Ideation 2.0 pitch deck.*\n\n` +
      `1. **Municipal Operational Savings**: Projected 28–35% reduction in secondary sorting and logistics expenses by segregating waste at the source.\n` +
      `2. **Decentralized Compost Revenue**: An estimated 12–18 metric tons/year of high-grade organic fertilizer per ward, valuated at ~$1,800–$2,500 in community resale or offset gardening costs.\n` +
      `3. **Water Resource Efficiency**: Projected 40% reduction in water utility expenses across urban botanical zones.\n` +
      `4. **Scalability**: Designed for standard low-cost microcontrollers ($45 prototype bill of materials per node).`;
  }

  if (q.includes('team') || q.includes('school') || q.includes('blossom') || q.includes('who built') || q.includes('creator')) {
    return `**ECOSPHERE Student Innovation Team**:\n\n` +
      `Developed with pride by student innovators at **Blossoms Convent School**.\n\n` +
      `• **Subsystem Architecture**: Dual-compartment smart waste segregation with optical counters.\n` +
      `• **Precision Agriculture**: Automated soil moisture monitoring with relay-driven drip irrigation.\n` +
      `• **Environmental Sensing**: Urban atmospheric gas and microclimate telemetrics.\n` +
      `• **Communication Bridge**: Serial daisy-chain linking 3 Arduino Megas to an ESP8266 NodeMCU Wi-Fi gateway.`;
  }

  if (q.includes('circuit') || q.includes('serial') || q.includes('arduino') || q.includes('nodemcu') || q.includes('code') || q.includes('hardware')) {
    return `**Hardware Architecture & Serial Chain Breakdown**:\n\n` +
      `The 3 Arduino Megas communicate via a daisy-chained hardware UART link:\n` +
      `1. **Waste Mega** (Pin 18 TX1) sends refuse packets to **Irrigation Mega**.\n` +
      `2. **Irrigation Mega** relays packets and attaches soil moisture telemetry to **Air Quality Mega**.\n` +
      `3. **Air Quality Mega** aggregates all data and transmits it to the **NodeMCU ESP8266**.\n` +
      `4. **NodeMCU ESP8266** forwards the data over Wi-Fi via HTTP POST to \`/api/sensors/packet\`.\n\n` +
      `You can view the full C++ sketch by clicking the **Hardware Setup** button in the top navigation bar!`;
  }

  return `I'm happy to chat! As CityPulse AI, I can discuss general topics or dive deep into the ECOSPHERE smart-city project by Blossoms Convent School.\n\n` +
    `Current System State: **${telemetry.connectionStatus}** | Dry Waste: ${telemetry.waste.dryCount} | Organic Waste: ${telemetry.waste.organicCount} | Soil Moisture: ${telemetry.irrigation.moisturePercent}% (Pump: ${telemetry.irrigation.pumpStatus}) | MQ-2 Raw: ${telemetry.air.pollutionRaw}.\n\n` +
    `Feel free to ask me anything—whether it's about the Arduino circuits, municipal waste savings, or simply asking "how are you today?"!`;
}
