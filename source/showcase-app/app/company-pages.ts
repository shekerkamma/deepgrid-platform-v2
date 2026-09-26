// Pages for the Software, Use Cases, About and Contact menus, built from deepgridsemi.com's content
// (captured 2026-09-26: content/reference/deepgridsemi/, structured/) under content/reconciliation.md:
// deepgridsemi.com is final where it overlaps the showcase; its template filler and unsourced
// claims are left out. Every section names the reference page it came from (`from`).
//
// Left out on purpose, with the reason:
// - SDK: the "end-to-end integrated software stack" paragraph is Axelera's Voyager SDK copy
//   ("AI Processing Units (AIPUs)", "available on GitHub", "Order Metis!").
// - ADAS: "ISO 26262 ASIL-D compliant" and "sub-10 ms latency" (no certificate; the reference's own
//   measured FPGA pipeline is 35.96 ms per frame).
// - About: "100+ team members" (the team page counts 28 engineers), "Founded 2020" (the home page
//   timeline says 2018), superlatives ("datacenter-class", "guaranteed", "unprecedented").
// - Achievements: six awards with no image or named source; only Top 50 Startups in Telangana is shown.
// - Team: engineers are shown as counts by domain, not by name.

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
    lede: 'The development toolkit for deploying AI models on DeepGrid silicon: optimise a trained model, run it on the chip, and profile it.',
    heroImage: { src: img('deepgridsemi/sdk.webp'), alt: 'Illustration of a developer deploying a model to an edge device' },
    sections: [
      { kind: 'cards', kicker: 'Key features', title: 'Everything needed to develop for DeepGrid platforms', cols: 3, from: REF + '/software/dgrid-sdk',
        items: [
          { title: 'Model optimisation', text: 'Optimise TensorFlow, PyTorch and ONNX models for DeepGrid hardware with automated quantisation and pruning.' },
          { title: 'CLI tools', text: 'A command-line interface for building, deploying and testing models.' },
          { title: 'Runtime libraries', text: 'Inference libraries that run the optimised model on the chip.' },
          { title: 'Performance profiling', text: 'Built-in profiling to analyse and tune a model on the target.' },
          { title: 'Pre-trained models', text: 'Access to a model zoo as a starting point.' },
          { title: 'Documentation', text: 'Guides, API references and tutorials.' },
        ] },
      { kind: 'cards', kicker: 'Supported frameworks', title: 'Bring a model from the framework it was trained in', cols: 4, from: REF + '/software/dgrid-sdk',
        items: [
          { title: 'TensorFlow Lite', meta: 'Full support' },
          { title: 'PyTorch', meta: 'Full support' },
          { title: 'OpenCV', meta: 'Full support' },
          { title: 'ONNX', meta: 'In progress' },
        ] },
      { kind: 'cta', title: 'Start developing', lede: 'Ask for SDK access and the documentation for your target.', from: REF + '/software/dgrid-sdk',
        actions: [ { label: 'Request SDK access', href: 'contact', primary: true }, { label: 'The silicon it targets', href: to('silicon') } ] },
    ],
  },

  // ------------------------------------------------------------------ Use cases
  {
    id: 'adas', menu: 'usecases', path: 'use-cases/adas', label: 'ADAS',
    kicker: 'Use case', title: 'Advanced driver assistance',
    lede: 'Real-time perception, sensor fusion and decision-making for driver assistance, tuned for Indian roads and now required by law on trucks and buses.',
    heroImage: { src: img('scenes/truck-1376.webp'), alt: 'Rendering of a DeepGrid-equipped truck on a highway at dusk' },
    chips: [['360° perception', 'Multi-sensor fusion for complete environmental awareness'], ['Safety first', 'Safety-critical execution'], ['Real time', '35.96 ms per frame, measured on the FPGA prototype']],
    sections: [
      { kind: 'split', kicker: 'ADAS AI platform', title: 'Perception, decision, safety-critical execution', from: REF + '/use-cases/adas',
        paras: [
          'Driver assistance needs AI that can perceive, understand and react to complex traffic in real time. DeepGrid’s ADAS platform combines sensor fusion, AI perception and path planning for Level 2+ systems and above.',
          'Demonstrator systems run at TiHAN (IIT Hyderabad) and NATRAX Indore for ADAS truck and robotic use cases.',
        ],
        image: img('posters/truck.webp'), imageAlt: 'Simulation still of the AD2 truck kit’s sensor coverage' },
      { kind: 'cards', kicker: 'Solution stack', title: 'DeepGrid’s ADAS solution stack', cols: 3, from: REF + '/use-cases/adas',
        items: [
          { title: 'Sensor fusion', text: 'Camera, radar and LiDAR integrated for complete perception.' },
          { title: 'AI decision engine', text: 'Real-time path planning and obstacle avoidance.' },
          { title: 'Safety validation', text: 'Redundant safety paths and staged validation, from FPGA to silicon.' },
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
      { kind: 'cta', title: 'Build driver assistance on DeepGrid silicon', lede: 'Talk to us about the AD2 truck kit, the DG-A100 and the SDK.', from: REF + '/use-cases/adas',
        actions: [ { label: 'Contact us', href: 'contact', primary: true }, { label: 'The AD2 truck kit', href: to('portfolio?product=ad2') }, { label: 'DGrid SDK', href: 'software/dgrid-sdk' } ] },
    ],
  },
  {
    id: 'humanoids', menu: 'usecases', path: 'use-cases/humanoids', label: 'Humanoid robotics',
    kicker: 'Use case', title: 'Humanoid robotics',
    lede: 'Real-time perception, decision-making and interaction for the next generation of humanoid robots.',
    heroImage: { src: img('deepgridsemi/roboarm.webp'), alt: 'Illustration of an articulated robot arm' },
    chips: [['Motion control AI', 'Motor control for balance and locomotion'], ['Voice control', 'Natural-language commands'], ['Teleoperation', 'Remote control and monitoring in real time']],
    sections: [
      { kind: 'split', kicker: 'Humanoid AI platform', title: 'Perception, adaptive intelligence, human-like interaction', from: REF + '/use-cases/humanoids',
        paras: [
          'Robots that assist and collaborate need perception, reasoning and action in one loop. DeepGrid’s humanoid platform combines real-time perception, adaptive intelligence and precise motion control, for work from healthcare to logistics.',
        ] },
      { kind: 'steps', kicker: 'How it works', title: 'From perception to action', lede: 'One pipeline that takes a robot from sensing to moving.', from: REF + '/use-cases/humanoids',
        items: [
          { title: 'Perception', text: 'Multi-sensor fusion for 3D understanding of the environment.' },
          { title: 'Interpretation', text: 'Reasoning and context-aware decisions.' },
          { title: 'Planning', text: 'Motion planning and task sequencing.' },
          { title: 'Action', text: 'Precise motor control and adaptive behaviour.' },
        ] },
      { kind: 'cards', kicker: 'Key capabilities', title: 'What the platform brings to a humanoid', cols: 4, from: REF + '/use-cases/humanoids',
        items: [
          { title: '3D vision', text: 'Real-time depth perception at 30 FPS.', image: img('deepgridsemi/3dvision.webp') },
          { title: 'Natural language', text: 'Voice interaction and command understanding.', image: img('deepgridsemi/naturallanguage.webp') },
          { title: 'Dexterous control', text: 'Seven degrees of freedom with sub-millimetre precision.', image: img('deepgridsemi/roboarm.webp') },
          { title: 'Adaptive learning', text: 'Learns from real-world video.', image: img('deepgridsemi/adaptivelearning.webp') },
        ] },
      { kind: 'cards', kicker: 'Roadmap', title: 'What comes next', cols: 3, from: REF + '/use-cases/humanoids',
        items: [
          { title: 'Emotional intelligence', text: 'Facial recognition and emotion detection for empathetic interaction.' },
          { title: 'Multi-robot collaboration', text: 'Coordinated task execution with distributed decision-making.' },
          { title: 'General-purpose AI', text: 'Adaptive learning across tasks without task-specific programming.' },
        ] },
      { kind: 'cta', title: 'Build humanoid robots on DeepGrid silicon', lede: 'Partner with us on perception and control for your platform.', from: REF + '/use-cases/humanoids',
        actions: [ { label: 'Collaborate with us', href: 'contact', primary: true }, { label: 'DGrid SDK', href: 'software/dgrid-sdk' } ] },
    ],
  },
  {
    id: 'mobility', menu: 'usecases', path: 'use-cases/mobility', label: 'Smart mobility',
    kicker: 'Use case', title: 'Smart mobility',
    lede: 'AI for fleet management, routing and logistics: vehicles that report their own health and routes that plan themselves.',
    heroImage: { src: img('scenes/port-1376.webp'), alt: 'Rendering of autonomous container vehicles in a port yard at night' },
    chips: [['Smart routing', 'Routes optimised for fuel and time'], ['Fleet connectivity', 'Real-time tracking and communication'], ['Predictive maintenance', 'Vehicle health monitoring and diagnostics']],
    sections: [
      { kind: 'split', kicker: 'Smart mobility platform', title: 'Intelligent routing, fleet optimisation, predictive analytics', from: REF + '/use-cases/mobility',
        paras: [
          'Electric vehicles, autonomous fleets and on-demand transport are changing how goods and people move. DeepGrid’s mobility platform helps operators cut cost and improve service through fleet management, routing and predictive maintenance.',
          'In the DeepGrid portfolio this is the Seaport AGV, an autonomous container-yard vehicle, and Autonomous TaaS, a vehicle DeepGrid operates under contract on a fixed route.',
        ],
        image: img('posters/yard.webp'), imageAlt: 'Simulation still of the Seaport AGV in a container yard' },
      { kind: 'cards', kicker: 'Solution stack', title: 'DeepGrid’s mobility solution stack', cols: 3, from: REF + '/use-cases/mobility',
        items: [
          { title: 'Route optimisation', text: 'AI routing for fuel efficiency and time savings.' },
          { title: 'Fleet intelligence', text: 'Real-time analytics and predictive insight.' },
          { title: 'Asset tracking', text: 'GPS and IoT integration for complete visibility.' },
        ] },
      { kind: 'cta', title: 'Build intelligent transport systems', lede: 'Talk to us about yard autonomy and fleet intelligence.', from: REF + '/use-cases/mobility',
        actions: [ { label: 'Contact us', href: 'contact', primary: true }, { label: 'Seaport AGV', href: to('portfolio?product=agv') }, { label: 'Autonomous TaaS', href: to('portfolio?product=taas') } ] },
    ],
  },
  {
    id: 'robotics', menu: 'usecases', path: 'use-cases/robotics', label: 'Industrial robotics',
    kicker: 'Use case', title: 'Industrial robotics',
    lede: 'AI-driven robotics for manufacturing, logistics and warehouse operations.',
    heroImage: { src: img('scenes/warehouse-1376.webp'), alt: 'Rendering of an autonomous forklift in a warehouse aisle' },
    chips: [['Precision control', 'Sub-millimetre accuracy for manufacturing tasks'], ['Multi-robot coordination', 'Synchronised operation across a workflow'], ['Real-time adaptation', 'Responds as production needs change']],
    sections: [
      { kind: 'split', kicker: 'Industrial robotics platform', title: 'Intelligent automation, precision control, adaptive learning', from: REF + '/use-cases/robotics',
        paras: [
          'Factories and warehouses need robots that adapt to changing production, work beside people and optimise in real time. DeepGrid’s robotics platform provides the AI processing for vision-guided manipulation, collaborative robots and autonomous material handling.',
          'In the DeepGrid portfolio this is the AD1 indoor L4 kit, a self-driving retrofit for indoor vehicles such as forklifts.',
        ],
        image: img('posters/forklift.webp'), imageAlt: 'Simulation still of an autonomous forklift in a warehouse' },
      { kind: 'cards', kicker: 'Solution stack', title: 'DeepGrid’s robotics solution stack', cols: 3, from: REF + '/use-cases/robotics',
        items: [
          { title: 'Vision processing', text: 'Real-time object detection and quality inspection.' },
          { title: 'Motion planning', text: 'Collision-free path planning and trajectory optimisation.' },
          { title: 'Fleet management', text: 'Coordinated control of multiple robots and AGVs.' },
        ] },
      { kind: 'cta', title: 'Build intelligent robotic systems', lede: 'Talk to us about indoor autonomy and robot perception.', from: REF + '/use-cases/robotics',
        actions: [ { label: 'Contact us', href: 'contact', primary: true }, { label: 'AD1 indoor L4 kit', href: to('portfolio?product=ad1') } ] },
    ],
  },

  // ------------------------------------------------------------------ About
  {
    id: 'story', menu: 'about', path: 'about', label: 'Our story',
    kicker: 'About', title: 'A semiconductor company for edge AI, in Hyderabad',
    lede: 'DeepGrid Semi designs System-on-Chip solutions that bring AI acceleration to edge devices: vehicles, robots, industrial automation and infrastructure.',
    sections: [
      { kind: 'stats', from: REF + '/about/team', items: [['28', 'Engineers across four domains'], ['4', 'Product lines'], ['T-Hub', 'Hyderabad, India']] },
      { kind: 'split', kicker: 'Who we are', title: 'Chip design, AI and autonomous systems under one roof', from: REF + '/about/story',
        paras: [
          'DeepGrid Semi specialises in AI acceleration for edge computing. It was founded by a team with long experience in chip design, AI and autonomous systems.',
          'Engineers and researchers work from the company’s headquarters at T-Hub in Hyderabad.',
          'The focus is System-on-Chip solutions that put real-time intelligence in autonomous vehicles, robotics, industrial automation and smart infrastructure.',
        ],
        image: img('scenes/die-1376.webp'), imageAlt: 'Rendering of the DeepGrid SoC2 die' },
      { kind: 'cards', kicker: 'Company strategy', title: 'Philosophy, vision and mission', cols: 3, from: REF + '/about/story',
        items: [
          { title: 'Our philosophy', text: 'Innovate with a purpose: solve real-world problems that affect road safety and mobility, with practical, high-performance solutions that raise driver awareness, anticipate hazards and respond fast.' },
          { title: 'Our vision', text: 'Towards zero fatalities on roads: a world where AI-powered automotive technology greatly reduces traffic accidents.' },
          { title: 'Our mission', text: 'Develop intelligent chipsets that give vehicles predictive safety features and real-time assistance, and set new benchmarks for ADAS.' },
        ] },
      { kind: 'cards', kicker: 'Our values', title: 'What the work is held to', cols: 4, from: REF + '/about/story',
        items: [
          { title: 'Innovation', text: 'Exploring new technologies and methods to improve automotive safety.' },
          { title: 'Safety', text: 'Keeping drivers and passengers safe is the foundation of every development.' },
          { title: 'Quality', text: 'Reliable, high-performance technology designed for stringent automotive standards.' },
          { title: 'Collaboration', text: 'Working closely with manufacturers and partners to bring ADAS to market.' },
        ] },
      { kind: 'steps', kicker: 'From concept to implementation', title: 'How an idea becomes a product', lede: 'Research, testing and collaboration, aimed at hard driving conditions such as low visibility and unpredictable obstacles.', from: REF + '/about/story',
        items: [
          { title: 'Research', text: 'Research and development toward each solution.' },
          { title: 'Testing', text: 'Real-world validation and optimisation.' },
          { title: 'Collaboration', text: 'Working with manufacturers and partners.' },
          { title: 'Practical solutions', text: 'Built for effectiveness in real conditions.' },
        ] },
      { kind: 'cta', title: 'Join us', lede: 'Partner with us, join the team, or learn more about the technology.', from: REF + '/about/story',
        actions: [ { label: 'Get in touch', href: 'contact', primary: true }, { label: 'Leadership and team', href: 'about/team' } ] },
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
    id: 'recognition', menu: 'about', path: 'about/recognition', label: 'Recognition',
    kicker: 'About', title: 'Top 50 Startups in Telangana, 2024',
    lede: 'Recognised for building India’s edge-first semiconductor and AI ecosystem with the DGrid SoC.',
    sections: [
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
