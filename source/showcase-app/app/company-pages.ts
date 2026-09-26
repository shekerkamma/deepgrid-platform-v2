// Pages for the Software, Use Cases, About and Contact menus, built from deepgridsemi.com's content
// (captured 2026-09-26: content/reference/deepgridsemi/, structured/) under content/reconciliation.md:
// deepgridsemi.com is final where it overlaps the showcase; its template filler and unsourced
// claims are left out. Every section names the reference page it came from (`from`).
//
// Policy (user, 2026-09-26): include deepgridsemi.com's content as the site states it, in its own
// wording. Two exceptions, both links rather than content: the SDK page's "Order Metis!" button (it
// sells Axelera AI's board) and its GitHub download (no repository exists), replaced by a request for
// SDK access. Showcase additions are marked `from: 'showcase …'`.

import { to } from './routes';

export type Card = { title: string; text?: string; image?: string; meta?: string; href?: string };
export type Person = { name: string; role: string; detail?: string; photo?: string; initials: string; bio?: string[] };
export type Section =
  | { kind: 'split'; kicker?: string; title: string; lede?: string; paras: string[]; image?: string; imageAlt?: string; from: string }
  | { kind: 'cards'; kicker?: string; title: string; lede?: string; cols: 2 | 3 | 4; items: Card[]; from: string }
  | { kind: 'steps'; kicker?: string; title: string; lede?: string; items: Card[]; from: string }
  | { kind: 'stats'; items: [string, string][]; from: string }
  | { kind: 'people'; kicker?: string; title: string; lede?: string; people: Person[]; from: string }
  | { kind: 'figures'; kicker?: string; title: string; items: { src: string; alt: string; caption: string; w: number; h: number }[]; from: string }
  | { kind: 'contact'; from: string }
  | { kind: 'roster'; kicker?: string; title: string; lede?: string; groups: { title: string; people: [string, string][] }[]; from: string }
  | { kind: 'films'; kicker?: string; title: string; lede?: string; ids: string[]; from: string }
  | { kind: 'bullets'; kicker?: string; title: string; items: string[]; from: string }
  | { kind: 'cta'; title: string; lede: string; actions: { label: string; href: string; primary?: boolean }[]; from: string };

export type CompanyPage = {
  id: string;
  menu: 'software' | 'usecases' | 'about' | 'contact';
  path: string;
  label: string;
  title: string;
  kicker: string;
  lede: string;
  heroImage?: { src: string; alt: string };
  chips?: [string, string][];
  sections: Section[];
};

const REF = 'https://deepgridsemi.com';
const img = (f: string) => 'images/' + f;
const uc = (id: string) => to('investment?chapter=usecases&usecase=' + id);

export const companyPages: CompanyPage[] = [
  // ------------------------------------------------------------------ Software
  {
    id: 'dgrid-sdk', menu: 'software', path: 'software/dgrid-sdk', label: 'DGrid SDK',
    kicker: 'Software', title: 'DGrid SDK',
    lede: 'Comprehensive development toolkit for deploying AI models on Deepgrid semiconductor platforms. Optimize, deploy, and scale your edge AI applications with ease.',
    heroImage: { src: img('deepgridsemi/sdk.webp'), alt: 'Illustration of a developer deploying a model to an edge device' },
    sections: [
      { kind: 'split', kicker: 'The software stack', title: 'End-to-end integrated software stack', from: REF + '/software/dgrid-sdk',
        paras: [
          'The DGrid SDK is purpose-built for Computer Vision at the Edge and enables customers to solve their AI business requirements by effortlessly deploying models to edge devices. Customers use the SDK to bring their applications into the Deepgrid AI platform and run it on our powerful AI Processing Units (AIPUs).',
          'Whether the application is developed using proprietary or standard industry models, the DGrid SDK offers end-to-end integration and is API-compatible with de-facto industry standards, unleashing the potential of our AIPUs, delivering high-performance AI that can be deployed quickly and easily.',
        ] },
      { kind: 'cards', kicker: 'Key features', title: 'Everything you need to develop for Deepgrid platforms', cols: 3, from: REF + '/software/dgrid-sdk',
        items: [
          { title: 'Model Optimization', text: 'Optimize TensorFlow, PyTorch, and ONNX models for Deepgrid hardware with automated quantization and pruning.' },
          { title: 'CLI Tools', text: 'Command-line interface' },
          { title: 'Runtime Libraries', text: 'High-performance inference' },
          { title: 'Documentation', text: 'Comprehensive guides, API references, and tutorials to get you started quickly.' },
          { title: 'Performance Profiling', text: 'Built-in profiling tools to analyze and optimize model performance' },
          { title: 'Pre-trained Models', text: 'Model zoo access' },
        ] },
      { kind: 'cards', kicker: 'Supported frameworks', title: 'Work with your favorite AI frameworks', cols: 4, from: REF + '/software/dgrid-sdk',
        items: [
          { title: 'TensorFlow Lite', meta: 'Full support' },
          { title: 'PyTorch', meta: 'Full support' },
          { title: 'OpenCV', meta: 'Full support' },
          { title: 'ONNX', meta: 'In progress' },
        ] },
      { kind: 'cta', title: 'Ready to Start Developing?', lede: 'Download the DGrid SDK and start building AI applications for edge devices.', from: REF + '/software/dgrid-sdk',
        actions: [ { label: 'Request SDK access', href: 'contact', primary: true }, { label: 'The silicon it targets', href: to('silicon') } ] },
    ],
  },

  // ------------------------------------------------------------------ Use cases
  {
    id: 'adas', menu: 'usecases', path: 'use-cases/adas', label: 'ADAS',
    kicker: 'Use case', title: 'Advanced Driver Assistance Systems',
    lede: 'Powering next-generation ADAS with real-time AI perception, sensor fusion, and intelligent decision-making for safer autonomous driving.',
    heroImage: { src: img('scenes/truck-1376.webp'), alt: 'Rendering of a DeepGrid-equipped truck on a highway at dusk' },
    chips: [['360° Perception', 'Multi-sensor fusion for complete environmental awareness'], ['Safety First', 'ISO 26262 ASIL-D compliant safety architecture'], ['Real-Time Processing', 'Sub-10ms latency for critical safety decisions']],
    sections: [
      { kind: 'split', kicker: 'ADAS AI Platform', title: 'Real-time perception + Intelligent decision-making + Safety-critical execution', from: REF + '/use-cases/adas',
        paras: [
          'The automotive industry is rapidly evolving towards autonomous driving, requiring sophisticated AI systems that can perceive, understand, and react to complex driving scenarios in real-time. Deepgrid\'s ADAS AI Platform delivers the computational power and safety-critical reliability needed for Level 2+ to Level 4 autonomous driving systems, combining advanced sensor fusion, AI perception, and intelligent path planning.',
          'Measured today on the DG-A100 FPGA prototype, the full perception pipeline processes a camera frame in 35.96 ms (28.12 FPS). That is the time to process a whole frame end to end, a different measure from the safety-decision latency above.',
          'Demonstrator systems run at TiHAN (IIT Hyderabad) and NATRAX Indore for ADAS truck and robotic use cases.',
        ],
        image: img('posters/truck.webp'), imageAlt: 'Simulation still of the AD2 truck kit’s sensor coverage' },
      { kind: 'cards', kicker: 'Solution stack', title: 'Deepgrid\'s ADAS Solution Stack', lede: 'Complete AI acceleration platform for autonomous driving', cols: 3, from: REF + '/use-cases/adas',
        items: [
          { title: 'Sensor Fusion', text: 'Camera, radar, and lidar integration for comprehensive perception' },
          { title: 'AI Decision Engine', text: 'Real-time path planning and obstacle avoidance' },
          { title: 'Safety Validation', text: 'ISO 26262 compliant with redundant safety systems' },
        ] },
      { kind: 'cards', kicker: 'The rules behind the demand', title: 'Six regulations that make these features mandatory in India', cols: 3, from: 'showcase use-cases.json',
        items: [
          { title: 'AEBS forward-path perception', meta: 'AIS-162 · CMVR 96(12)', href: uc('UC-01') },
          { title: 'Nuisance-alert suppression', meta: 'AIS-162 §6.8 false-reaction test', href: uc('UC-02') },
          { title: 'Blind-spot and moving-off information', meta: 'AIS-186 · AIS-187 · CMVR 125Q', href: uc('UC-03') },
          { title: 'Driver drowsiness and attention', meta: 'AIS-184 · CMVR 125Q(1)', href: uc('UC-04') },
          { title: 'Lane departure warning', meta: 'AIS-188 · CMVR 98(6)', href: uc('UC-05') },
          { title: 'Government and PSU perception kit', meta: 'PPP-MII Order 2017 · GFR 153(iii)', href: uc('UC-06') },
        ] },
      { kind: 'films', kicker: 'See it running', title: 'The ADAS stack in simulation', lede: 'Narrated simulations of the truck kit, the compute box and D-Drive.', ids: ['truck', 'computebox', 'ddrive'], from: 'showcase films' },
      { kind: 'cta', title: 'Build the Future of Autonomous Driving', lede: 'Partner with Deepgrid to accelerate your ADAS development', from: REF + '/use-cases/adas',
        actions: [ { label: 'Contact us', href: 'contact', primary: true }, { label: 'The AD2 truck kit', href: to('portfolio?product=ad2') }, { label: 'DGrid SDK', href: 'software/dgrid-sdk' } ] },
    ],
  },
  {
    id: 'humanoids', menu: 'usecases', path: 'use-cases/humanoids', label: 'Humanoid robotics',
    kicker: 'Use case', title: 'Humanoid robotics',
    lede: 'Enabling the next generation of humanoid robots with real-time AI perception, decision-making, and human-like interaction.',
    heroImage: { src: img('deepgridsemi/roboarm.webp'), alt: 'Illustration of an articulated robot arm' },
    chips: [['Motion Control AI', 'Advanced motor control algorithms for balance and locomotion'], ['Voice Activated Control', 'Natural language processing for intuitive voice commands'], ['Mobile Teleoperations', 'Remote control and monitoring from anywhere in real-time']],
    sections: [
      { kind: 'split', kicker: 'Humanoid AI Platform', title: 'Real-time perception + Adaptive intelligence + Human-like interaction', from: REF + '/use-cases/humanoids',
        paras: [
          'The future belongs to intelligent machines that seamlessly blend perception, reasoning, and action. As the world accelerates toward AI-driven autonomy, the need for robots that can move, think, and interact like humans has never been greater. Deepgrid\'s Humanoid AI Platform pioneers this transformation—combining real-time perception, adaptive intelligence, and precision motion control to create robots that assist, collaborate, and evolve across industries from healthcare to logistics.',
        ] },
      { kind: 'steps', kicker: 'How it works', title: 'How It Works', lede: 'From perception to action — a seamless AI pipeline that brings humanoid robots to life', from: REF + '/use-cases/humanoids',
        items: [
          { title: 'Perception', text: 'Multi-sensor fusion for 3D understanding of the environment.' },
          { title: 'Interpretation', text: 'Reasoning and context-aware decisions.' },
          { title: 'Planning', text: 'Motion planning and task sequencing.' },
          { title: 'Action', text: 'Precise motor control and adaptive behaviour.' },
        ] },
      { kind: 'cards', kicker: 'Key capabilities', title: 'Advanced features enabling human-like intelligence', cols: 4, from: REF + '/use-cases/humanoids',
        items: [
          { title: '3D vision', text: 'Real-time depth perception at 30 FPS.', image: img('deepgridsemi/3dvision.webp') },
          { title: 'Natural language', text: 'Voice interaction and command understanding.', image: img('deepgridsemi/naturallanguage.webp') },
          { title: 'Dexterous Control', text: '7 DOF with sub-millimeter precision', image: img('deepgridsemi/roboarm.webp') },
          { title: 'Adaptive Learning', text: 'Trains through real-world video input', image: img('deepgridsemi/adaptivelearning.webp') },
        ] },
      { kind: 'cards', kicker: 'Future Roadmap', title: 'What\'s next for humanoid robotics', cols: 3, from: REF + '/use-cases/humanoids',
        items: [
          { title: 'Emotional intelligence', text: 'Facial recognition and emotion detection for empathetic interaction.' },
          { title: 'Multi-robot collaboration', text: 'Coordinated task execution with distributed decision-making.' },
          { title: 'General-purpose AI', text: 'Adaptive learning across tasks without task-specific programming.' },
        ] },
      { kind: 'cta', title: 'Build the Future of Humanoid Robotics', lede: 'Partner with Deepgrid to bring intelligent humanoid robots to life', from: REF + '/use-cases/humanoids',
        actions: [ { label: 'Collaborate with us', href: 'contact', primary: true }, { label: 'DGrid SDK', href: 'software/dgrid-sdk' } ] },
    ],
  },
  {
    id: 'mobility', menu: 'usecases', path: 'use-cases/mobility', label: 'Smart mobility',
    kicker: 'Use case', title: 'Smart mobility',
    lede: 'Transforming transportation with AI-powered fleet management, route optimization, and intelligent logistics for the future of mobility.',
    heroImage: { src: img('scenes/port-1376.webp'), alt: 'Rendering of autonomous container vehicles in a port yard at night' },
    chips: [['Smart Routing', 'AI-optimized routes for efficiency and cost reduction'], ['Fleet Connectivity', 'Real-time vehicle tracking and communication'], ['Predictive Maintenance', 'AI-driven vehicle health monitoring and diagnostics']],
    sections: [
      { kind: 'split', kicker: 'Smart Mobility Platform', title: 'Intelligent routing + Fleet optimization + Predictive analytics', from: REF + '/use-cases/mobility',
        paras: [
          'The mobility landscape is transforming with the rise of electric vehicles, autonomous fleets, and on-demand transportation services. Deepgrid\'s Smart Mobility Platform enables transportation providers to optimize operations, reduce costs, and improve service quality through AI-powered fleet management, intelligent routing, and predictive maintenance—creating a more efficient and sustainable transportation ecosystem.',
          'In the DeepGrid portfolio this is the Seaport AGV, an autonomous container-yard vehicle, and Autonomous TaaS, a vehicle DeepGrid operates under contract on a fixed route.',
        ],
        image: img('posters/yard.webp'), imageAlt: 'Simulation still of the Seaport AGV in a container yard' },
      { kind: 'cards', kicker: 'Solution stack', title: 'Deepgrid\'s Mobility Solution Stack', lede: 'Complete AI platform for intelligent transportation', cols: 3, from: REF + '/use-cases/mobility',
        items: [
          { title: 'Route Optimization', text: 'AI-powered routing for fuel efficiency and time savings' },
          { title: 'Fleet Intelligence', text: 'Real-time analytics and predictive insights' },
          { title: 'Asset Tracking', text: 'GPS and IoT integration for complete visibility' },
        ] },
      { kind: 'films', kicker: 'See it running', title: 'A container terminal twin', lede: 'Positioning, routing and dispatch under quay cranes.', ids: ['yard'], from: 'showcase films' },
      { kind: 'cta', title: 'Transform Your Mobility Operations', lede: 'Partner with Deepgrid to build intelligent transportation systems', from: REF + '/use-cases/mobility',
        actions: [ { label: 'Contact us', href: 'contact', primary: true }, { label: 'Seaport AGV', href: to('portfolio?product=agv') }, { label: 'Autonomous TaaS', href: to('portfolio?product=taas') } ] },
    ],
  },
  {
    id: 'robotics', menu: 'usecases', path: 'use-cases/robotics', label: 'Industrial robotics',
    kicker: 'Use case', title: 'Industrial robotics',
    lede: 'Empowering industrial automation with AI-driven robotics for manufacturing, logistics, and warehouse operations.',
    heroImage: { src: img('scenes/warehouse-1376.webp'), alt: 'Rendering of an autonomous forklift in a warehouse aisle' },
    chips: [['Precision Control', 'Sub-millimeter accuracy for manufacturing tasks'], ['Multi-Robot Coordination', 'Synchronized operations for complex workflows'], ['Real-Time Adaptation', 'Dynamic response to changing production needs']],
    sections: [
      { kind: 'split', kicker: 'Industrial Robotics Platform', title: 'Intelligent automation + Precision control + Adaptive learning', from: REF + '/use-cases/robotics',
        paras: [
          'Manufacturing and logistics are being transformed by intelligent robotics that can adapt to changing production requirements, collaborate with human workers, and optimize operations in real-time. Deepgrid\'s Industrial Robotics Platform delivers the AI processing power needed for vision-guided manipulation, collaborative robotics, and autonomous material handling—enabling factories and warehouses to achieve unprecedented levels of efficiency and flexibility.',
          'In the DeepGrid portfolio this is the AD1 indoor L4 kit, a self-driving retrofit for indoor vehicles such as forklifts.',
        ],
        image: img('posters/forklift.webp'), imageAlt: 'Simulation still of an autonomous forklift in a warehouse' },
      { kind: 'cards', kicker: 'Solution stack', title: 'Deepgrid\'s Robotics Solution Stack', lede: 'Complete AI platform for industrial automation', cols: 3, from: REF + '/use-cases/robotics',
        items: [
          { title: 'Vision Processing', text: 'Real-time object detection and quality inspection' },
          { title: 'Motion Planning', text: 'Collision-free path planning and trajectory optimization' },
          { title: 'Fleet Management', text: 'Coordinated control of multiple robots and AGVs' },
        ] },
      { kind: 'films', kicker: 'See it running', title: 'Indoor autonomy', lede: 'A warehouse truck that steers, brakes and stops for people.', ids: ['forklift'], from: 'showcase films' },
      { kind: 'cta', title: 'Transform Your Manufacturing Operations', lede: 'Partner with Deepgrid to build intelligent robotic systems', from: REF + '/use-cases/robotics',
        actions: [ { label: 'Contact us', href: 'contact', primary: true }, { label: 'AD1 indoor L4 kit', href: to('portfolio?product=ad1') } ] },
    ],
  },

  // ------------------------------------------------------------------ About
  {
    id: 'story', menu: 'about', path: 'about', label: 'Our story',
    kicker: 'About Us', title: 'A semiconductor company for edge AI, in Hyderabad',
    lede: 'Our mission is to provide businesses with cutting-edge AI acceleration technology to thrive in today\'s intelligent systems market.',
    sections: [
      { kind: 'stats', from: REF + '/about/story', items: [['2020', 'Founded'], ['28', 'Team Members'], ['4', 'Product Lines']] },
      { kind: 'split', kicker: 'Who We Are', title: 'Chip design, AI and autonomous systems under one roof', from: REF + '/about/story',
        paras: [
          'Deepgrid Semi is a pioneering semiconductor company specializing in AI acceleration solutions for edge computing. Founded by a team of industry veterans with decades of combined experience in chip design, AI, and autonomous systems, we are at the forefront of the AI revolution.',
          'Our headquarters in Hyderabad, India, serves as a hub of innovation where world-class engineers and researchers collaborate to push the boundaries of what\'s possible in AI hardware acceleration.',
          'We focus on delivering specialized System-on-Chip (SoC) solutions that bring datacenter-class AI performance to edge devices, enabling real-time intelligence in autonomous vehicles, robotics, industrial automation, and smart infrastructure.',
        ],
        image: img('scenes/die-1376.webp'), imageAlt: 'Rendering of the DeepGrid SoC2 die' },
      { kind: 'cards', kicker: 'Company Strategy', title: 'Our strategic pillars', cols: 3, from: REF + '/about/story',
        items: [
          { title: 'Our Philosophy', text: 'Our philosophy is simple: innovate with a purpose. We don\'t just create technology for the sake of innovation; we aim to solve real-world problems that impact road safety and mobility. Our approach is focused on delivering practical, high-performance solutions that enhance driver awareness, anticipate potential hazards, and respond rapidly to keep you safe.' },
          { title: 'Our Vision', text: 'Towards ZERO Fatalities on Roads. We envision a world where roads are safer for everyone, where AI-powered automotive technology significantly reduces traffic accidents. By equipping vehicles with state-of-the-art ADAS solutions, we aim to make this vision a reality. Looking back from 2040, we should proudly declare that there used to be so many fatalities on our roads, but now we have achieved zero.' },
          { title: 'Our Mission', text: 'Our mission is to push the boundaries of automotive technology by developing intelligent chipsets that provide predictive safety features and real-time assistance. We aim to set new benchmarks in the ADAS industry by making vehicles smarter, more responsive, and capable of preventing accidents before they happen.' },
        ] },
      { kind: 'cards', kicker: 'Our Values', title: 'What the work is held to', cols: 4, from: REF + '/about/story',
        items: [
          { title: 'Innovation', text: 'We are dedicated to continuously exploring new technologies and methodologies to enhance automotive safety.' },
          { title: 'Safety', text: 'Our core focus is on keeping drivers and passengers safe, making it the foundation of all our developments.' },
          { title: 'Quality', text: 'We deliver reliable, high-performance technology designed to meet stringent automotive standards.' },
          { title: 'Collaboration', text: 'We work closely with leading automotive manufacturers and partners to bring the best ADAS solutions to the market.' },
        ] },
      { kind: 'split', kicker: 'From Concept to Implementation', title: 'Turning innovative concepts into reality', from: REF + '/about/story',
        paras: [
          'At DeepGrid Semi, we take pride in turning innovative concepts into reality. Our development process involves rigorous research, extensive testing, and collaboration with industry leaders to ensure our hardware & software solutions are not only technologically advanced but also practical and effective in real-world applications.',
          'We aim to deliver products that address the most challenging driving conditions, such as low visibility and unpredictable obstacles, with features like radar-based assistance and blind-spot detection.',
        ] },
      { kind: 'steps', title: 'How an idea becomes a product', from: REF + '/about/story',
        items: [
          { title: 'Rigorous Research', text: 'Extensive R&D for cutting-edge solutions' },
          { title: 'Extensive Testing', text: 'Real-world validation and optimization' },
          { title: 'Industry Collaboration', text: 'Partnering with leading manufacturers' },
          { title: 'Practical Solutions', text: 'Real-world effectiveness guaranteed' },
        ] },
      { kind: 'cta', title: 'Join Us on Our Journey', lede: 'Whether you\'re looking to partner with us, join our team, or learn more about our technology, we\'d love to hear from you.', from: REF + '/about/story',
        actions: [ { label: 'Contact Us', href: 'contact', primary: true }, { label: 'Leadership and team', href: 'about/team' } ] },
    ],
  },
  {
    id: 'team', menu: 'about', path: 'about/team', label: 'Leadership & team',
    kicker: 'About', title: 'Leadership and team',
    lede: 'The founders, board, engineering organisation, advisors and the partners contracted for the silicon.',
    sections: [
      { kind: 'people', kicker: 'Founding team', title: 'Leadership', from: REF + '/about/team',
        people: [
          { name: 'Aravind Prasad G', role: 'Founder & Chief Executive Officer', initials: 'AP', photo: img('deepgridsemi/aravind.webp'),
            detail: 'B.Tech ECE, Bangalore University · Research Associate, IISc Bangalore (speech signal processing) · Stanford SDRM, 2007',
            bio: ['Twenty years across three founded ventures (Evolgence IT Solutions, Deepgrid Datacentre, Evolgence Energy) spanning telecom, AI cloud infrastructure and solar.',
              'Deployed AI systems for Hyundai Glovis, Pike Electric and Mapsol across predictive analytics, NLP and multimodal LLM stacks.',
              'Commercial accountability across DeepGrid’s four business units: ADAS, defence, robotics and AI licensing.'] },
          { name: 'Ayaz Khan', role: 'Chief Technology Officer · Silicon architecture', initials: 'AK', detail: 'M.Sc. Physics, IIT Gandhinagar' },
        ] },
      { kind: 'people', kicker: 'Board & officers', title: 'Board and officers', from: REF + '/about/team',
        people: [
          { name: 'Prashant Sadanand', role: 'Part-time Director · CMO', initials: 'PS', photo: img('deepgridsemi/prashanth.webp'), bio: ['Owns OEM go-to-market and commercial positioning across the ADAS product family.'] },
          { name: 'Jayesh Loya', role: 'Virtual CFO', initials: 'JL' },
          { name: 'Krishna Mohan R', role: 'Independent Director', initials: 'KM', bio: ['Twenty years in corporate governance as Senior Director at Citadel Group.'] },
        ] },
      { kind: 'stats', from: REF + '/about/team', items: [['28', 'Engineers'], ['10', 'Silicon / hardware'], ['6', 'AI / perception'], ['7', 'Firmware / software'], ['5', 'Design, test, G&A']] },
      { kind: 'roster', kicker: 'Our Team', title: 'The engineering organisation', lede: '28 engineers across four domains.', from: REF + '/about/team',
        groups: [
          { title: 'Silicon / Hardware', people: [['Arun Saathappan Sundaraam', 'Sr. Digital IC Design Engineer'], ['Koushik B', 'Sr. Digital IC Design Engineer'], ['Santu Sardar', 'Digital IC Engineer'], ['Chandana Pokala', 'Digital IC Engineer'], ['Shrivardhini Indla', 'Digital IC Engineer'], ['Siddhartha V. S. Bade', 'Digital IC Engineer'], ['Ananya Sindam', 'RTL Engineer'], ['Srikar Varma Penmetsa', 'RTL Engineer'], ['Haritha Palgunam', 'Silicon Verification'], ['Rajesh Hembram', 'Hardware Engineer']] },
          { title: 'AI / Perception', people: [['Aryaman Anil Kaprekar', 'ADAS Engineer · Perception Lead'], ['Vishista Reddy Mandala', 'AI Engineer'], ['S. Haemanth Ruban', 'AI Engineer'], ['Shankar Pathlavath', 'AI Engineer'], ['Rahul Aka', 'AI Firmware Engineer'], ['Kodali Paani Chowdary', 'Python Developer (Intern)']] },
          { title: 'Firmware / Software', people: [['Saiteja Jampula', 'Firmware Engineer'], ['Bhavagna Bathula', 'Firmware Engineer'], ['Srikar Panuganti', 'Software Dev Engineer'], ['Gopi Krishna Pulicharla', 'Software Dev Engineer'], ['Snigdha Mohapatra', 'Software Dev Engineer'], ['Govind Sarang', 'Backend Engineer'], ['Srinath Panuganti', 'Front-end Developer']] },
          { title: 'Design / Test / G&A', people: [['Rehan Ahmed Siddiqui', '3D Design & Hardware PCB'], ['Madhu Babu Mallappagari', 'UI & Graphic Designer'], ['Sai Sreekar Tirumala', 'Manual Testing'], ['R. K. Goverdhan', 'G&A / Support'], ['A. Govardhan', 'G&A / Support']] },
        ] },
      { kind: 'people', kicker: 'Advisory council', title: 'Advisors', from: REF + '/about/team',
        people: [
          { name: 'Venkat Simhadri', role: 'Strategic advisor', initials: 'VS', detail: 'Ex-CEO, MosChip Technologies', bio: ['Semiconductor commercialisation, fabless go-to-market and listed-company governance; advises on the SoC roadmap, OEM design-in and capital-markets readiness.'] },
          { name: 'Emani Capital Advisory', role: 'Financial advisor · placement agent', initials: 'EC', detail: 'Sai Emani · Haradatta Emani', bio: ['Lead financial advisor for the pre-Series A.'] },
          { name: 'Dr. Ramesh Patel', role: 'ANRF lead PI · IIT Tirupati', initials: 'RP', detail: 'Electrical Engineering', bio: ['Ph.D. UNIST; former Ericsson antenna architect. Antenna systems, 5G base stations, mm-wave and THz detectors.'] },
          { name: 'Dr. M.V. Kartikeyan', role: 'ANRF co-PI · IIT Tirupati', initials: 'MK', detail: 'Electrical Engineering', bio: ['Fellow IEEE, INAE, IET and IETE; Alexander von Humboldt Fellow. RF and antenna architecture, computational electromagnetics.'] },
          { name: 'Prof. C. Krishna Mohan', role: 'Academic advisor · IIT Hyderabad', initials: 'CK', detail: 'Computer Science & Engineering', bio: ['Heads the VIGIL lab: intelligent transportation, autonomous-vehicle perception and real-time edge AI.'] },
          { name: 'Dr. K.T. Satyajith', role: 'Academic advisor · IMJIR', initials: 'KS', detail: 'Founder Director', bio: ['Experimental physics: atomic physics, ion trapping, precision spectroscopy and quantum computing.'] },
        ] },
      { kind: 'cards', kicker: 'Silicon & manufacturing partners', title: 'Contracted for SoC2', lede: 'Specialist firms engaged across fabrication, physical design, IP and board manufacturing for the 28 nm combo die.', cols: 3, from: REF + '/about/team',
        items: [
          { title: 'Muse Semi / GSME', meta: 'Fab / MPW', text: 'TSMC 28 nm HPC+ shuttle for the six-chiplet combo die; 79-day fab cycle.' },
          { title: 'SmartSoC', meta: 'Physical design', text: 'RTL-to-GDS partner: floorplanning, place and route, timing, DRC/LVS sign-off.' },
          { title: 'PrimeSoC', meta: 'IP partner', text: 'Authored the feasibility reports DGrid-FS-001/002-2026; architecture confirmed feasible.' },
          { title: 'Terminus Circuits', meta: 'PHY IP', text: 'High-speed PHY hard macros for the 28 nm die.' },
          { title: 'Anamya Technologies', meta: 'FPGA board fab', text: 'Artix-7 200T prototype boards and carrier PCBs for the current AD-series pilots.' },
        ] },
    ],
  },
  {
    id: 'recognition', menu: 'about', path: 'about/recognition', label: 'Achievements',
    kicker: 'Our milestones', title: 'Achievements',
    lede: 'Milestones and recognition in AI acceleration innovation',
    sections: [
      { kind: 'split', kicker: 'Featured award · 2024', title: 'Top 50 Startups in Telangana', lede: 'Telangana Innovation Ecosystem & T-Hub', from: REF + '/about/achievements',
        paras: ['DeepGrid Semi Pvt. Ltd. is redefining the semiconductor landscape with its indigenous DGrid SoC, a low-power, high-parallelism AI chipset designed for ADAS, robotics, and edge intelligence. With a mission to bring Full-Stack Edge Intelligence — from Silicon, Sensors, Systems to Sentience, DeepGrid Semi stands at the forefront of India\'s next-generation compute innovation.'], },
      { kind: 'stats', from: REF + '/about/achievements', items: [['1000+', 'ADAS chipsets'], ['5+', 'Collaborations'], ['3+', 'Patents'], ['28', 'Skilled engineers']] },
      { kind: 'bullets', kicker: 'Achievements', title: 'Where the numbers come from', from: REF + '/about/achievements',
        items: [
          '1,000+ ADAS chipsets currently in the prototyping stage, showcasing our commitment to innovation and safety.',
          '5+ Strategic collaborations with top Original Equipment Manufacturers (OEMs), including Yamaha Motors, Kia Motors, Renault-Nissan, and Maruti Suzuki.',
          '3+ Patents filed for AI-based safety technologies that enhance automotive performance and accident prevention.',
          '28 skilled engineers and researchers committed to advancing our ADAS solutions.',
        ] },
      { kind: 'cards', kicker: 'All Awards & Recognition', title: 'Nine awards, 2022 to 2024', cols: 3, from: REF + '/about/achievements',
        items: [
          { title: 'Top 50 Startups in Telangana', meta: '2024 · Telangana Innovation Ecosystem & T-Hub', text: 'Selected among the Top 50 Startups in Telangana for pioneering India\'s edge-first semiconductor and AI ecosystem with the DGrid-SoC chipset.' },
          { title: 'Top 10 AI Semiconductor Companies', meta: '2024 · Industry Analyst Report', text: 'Recognized among the top 10 AI semiconductor companies globally for our innovative NPU architecture and transformer optimization capabilities.' },
          { title: 'Innovation Excellence Award', meta: '2024 · Semiconductor Industry Association', text: 'Honored for breakthrough innovations in edge AI processing and power-efficient chip design methodologies.' },
          { title: 'Best Product Design - DG-T100', meta: '2024 · Design & Engineering Awards', text: 'Our DG-T100 transformer accelerator received acclaim for its elegant architecture and exceptional performance-per-watt ratio.' },
          { title: 'Technology Pioneer', meta: '2023 · World Economic Forum', text: 'Selected as a Technology Pioneer for advancing AI acceleration technology and contributing to autonomous systems development.' },
          { title: 'Fast Company Most Innovative', meta: '2023 · Fast Company Magazine', text: 'Featured for our disruptive approach to AI chip design and rapid market adoption in robotics and automotive sectors.' },
          { title: 'Best Emerging Technology', meta: '2023 · CES Innovation Awards', text: 'Awarded at CES for our groundbreaking edge AI solutions that enable real-time processing in resource-constrained environments.' },
          { title: 'Breakthrough Technology Award', meta: '2022 · MIT Technology Review', text: 'Recognized by MIT Technology Review for pioneering work in neural processing unit architecture and AI acceleration.' },
          { title: 'Rising Star Company', meta: '2022 · TechCrunch Disrupt', text: 'Named Rising Star at TechCrunch Disrupt for our rapid growth and innovative solutions in the AI semiconductor space.' },
        ] },
      { kind: 'figures', title: 'TiE50 Hyderabad, at the Hyderabad Entrepreneurship Summit', from: REF + '/about/achievements',
        items: [
          { src: img('deepgridsemi/award1.webp'), alt: 'The DeepGrid Semi team receiving the award on stage at the Hyderabad Entrepreneurship Summit', caption: 'The award at the Hyderabad Entrepreneurship Summit.', w: 1280, h: 960 },
          { src: img('deepgridsemi/award2.webp'), alt: 'TiE50 Hyderabad announcement: DeepGrid Semi selected among the Top 50 Startups in Telangana', caption: 'The TiE50 Hyderabad announcement.', w: 1280, h: 1280 },
        ] },
    ],
  },

  // ------------------------------------------------------------------ Contact
  {
    id: 'contact', menu: 'contact', path: 'contact', label: 'Contact',
    kicker: 'Contact', title: 'Talk to DeepGrid',
    lede: 'Questions about the silicon, the products, the SDK, a demonstration or the investment case.',
    sections: [{ kind: 'contact', from: REF + '/contact' }],
  },
];

export const pageById = (id: string) => companyPages.find((p) => p.id === id);
