# Content reconciliation: showcase vs deepgridsemi.com

**Rule (user, 2026-09-26).** Keep showcase content that is new information. Where the two overlap or
contradict, deepgridsemi.com is final. deepgridsemi.com carries template filler and unsourced
marketing ("a lot of AI slop"); only its substantive, accurate content counts.

Reference text: `content/reference/deepgridsemi/*.md` (rendered text of 21 pages, captured
2026-09-26).

## When a deepgridsemi.com statement counts (the slop test)

A reference statement is adopted only if all four hold:

1. **Specific to DeepGrid**: a named place, part, date, or a measurement with its context
   ("35.96 ms per frame on FPGA", "TiHAN, IIT Hyderabad"), not a category claim.
2. **Consistent across the reference's own pages.** Where the reference contradicts itself, the
   measured or more specific version wins and the conflict is listed below as open.
3. **Not a block copied verbatim between products.** The T100 and S100 pages share an identical
   specification block (ARM Cortex-A78AE, Mali-G78, 5 nm FinFET, 45 mm package, "3.3 TkeOPS/W");
   it describes neither part.
4. **Not an unsupported certification, award or superlative**: "ISO 26262 ASIL-D certified",
   "FDA IEC 62304", "industry-leading", seven awards without a source, Axelera-template names
   (Metis, Voyager).

A statement that fails the test does not overwrite showcase content; the showcase text stays.

## Adopted: where deepgridsemi.com overrides the showcase

| # | Subject | Showcase (before) | deepgridsemi.com (adopted) | Reference page |
|---|---|---|---|---|
| R1 | First silicon | "One 57.1 mm² combo die on TSMC 28 nm HPC+" under every SKU | First silicon on **SkyWater 130 nm**, 2026; FPGA-validated RTL today; process roadmap **28 nm → 5 nm** | products/dg-a100 (hero, specs, readiness, roadmap) |
| R2 | DG-A100 | "A100 Compute Box": modules carrying SoC2 | **DG-A100 ADAS SoC**: the chip. Target fusion 6 cameras + 2 radar + 1 LiDAR; current 1 IR + 1 RGB camera; <50 ms decision latency; measured FPGA pipeline 35.96 ms/frame, 28.12 FPS (SSD-MobileNet, edge detection, Harris corner, optical flow); 8-core RISC-V with vector engine (4 cores in test); SPI flash + HyperRAM now, DDR planned; −40 °C to +125 °C; <30 W target | products/dg-a100, home |
| R3 | Demonstrators | — (not stated) | Demonstrator systems at **TiHAN (IIT Hyderabad)** and **NATRAX Indore** for ADAS-truck and robotic use cases | products/dg-a100 |
| R4 | DG-T100 | "T100 AI Licence": models and toolchain, not hardware | **DG-T100 Transformer NPU**: an NPU for transformer models and LLMs, mixed precision FP16–INT4, on-device inference. Performance figures not adopted (the reference gives 200, 100 and "2–256+ per core" TOPS) | products/dg-t100, home |
| R5 | DG-R100 | "4D Radar Pod": a sealed pod feeding the compute box | **DG-R100 Radar SoC**: 4D imaging radar SoC, 76–81 GHz FMCW, MIMO, Ethernet and CAN-FD. Range not adopted (250 m on home, 300 m on its page) | products/dg-r100, home |
| R6 | DG-D100 | "D100 Drone SoC Kit": compute and perception kit for airframe builders | **DG-D100 Drone SoC**: autonomous-flight processor; navigation, obstacle avoidance, SLAM in GPS-denied settings. TOPS/W figures not adopted (60 TOPS/12 W vs 4–40 TOPS/5–30 W) | products/dg-d100, home |
| R7 | DG-H100 | "H100 Driver Monitor": a wrist-worn band with a radio link to the vehicle | **DG-H100 Healthcare SoC** (menu, home, product page). Compliance list (FDA, IEC 62304…) not adopted | products/dg-h100, home |
| R8 | DG-S100 | — | **DG-S100 SDV Controller**: centralized zonal compute for software-defined vehicles, OTA, AUTOSAR Adaptive, automotive Ethernet TSN | products/dg-s100, home |
| R9 | Company | (showcase figures) | Headquarters Hyderabad; recognised among the Top 50 Startups in Telangana, 2024 (with images) | about/story, about/achievements |

## Kept: showcase content that is new information

The fifteen products as offerings (AD2 truck kit, AD0 mirror, AD1 indoor kit, TaaS, Seaport AGV,
D-HUMR, thermal pod, the compute-box form factors, chipset supply), prices, revenue ramp, margins,
the investment case, the six regulatory use cases (AIS-162, BSIS/MOIS, DDAW, LDW, GeM), the 104-slide
deck, films and simulations, Ask DeepGrid. Where one of these names a chip, it now names the chip as
R1–R8 describe it.

## Open (needs the owner)

| # | Conflict | Where |
|---|---|---|
| O1 | The reference contradicts itself on A100 cores: "28-core RISC-V" (hero) vs "8-core RISC-V, 4 cores in test" (specs). Adopted the specs; the hero figure is not used. | products/dg-a100 |
| O2 | H100 is "Healthcare SoC" (menu, home, page) but "Humanoid SoC" in one bundle string; the showcase's H100 is a driver-monitor wearable. Adopted Healthcare; the driver-monitor product needs a name that is not H100, or removal. | home, bundle, showcase products.json |
| O3 | T100 as a chip (reference) vs a licence (showcase). Adopted the chip; the licence offering needs a name that is not T100, or it becomes "licence to the DG-T100 models". | products/dg-t100 |
| O4 | The showcase's economics assume one 28 nm die for all fifteen SKUs. With first silicon on 130 nm (R1), which SKUs ship on 130 nm and which wait for 28 nm is not stated by either source. | showcase investment, slide notes |
| O5 | Founding year: 2020 (about/story) vs 2018 (home timeline). Neither adopted until confirmed. | about/story, home |

## Answers to the open items (2026-09-26, self-answered under the user's standing instruction)

| # | Answer |
|---|---|
| O1 | A100 cores: the reference's specification (8-core RISC-V, vector engine, 4 cores in test) is used; its hero headline ("28-core") is not. |
| O2 | "H100" is the DG-H100 Healthcare SoC. The showcase's wrist-worn driver monitor keeps its content as **Driver Monitor Band**, without the H100 code. |
| O3 | "T100" is the DG-T100 Transformer NPU. The showcase's licence offering becomes **Licence: DG-T100 models and toolchain**. |
| O4 | First silicon is stated as SkyWater 130 nm (2026). The showcase's 28 nm die is presented as the roadmap production node, consistent with the reference's own "28 nm → 5 nm" roadmap. Which SKUs wait for 28 nm stays unstated until a source says. |
| O5 | Founding year omitted until confirmed. |

## Correction (2026-09-26): R1 and O4 were wrong

deepgridsemi.com's **team page** names the contracted partners for SoC2: "Muse Semi / GSME — TSMC 28nm
HPC+ shuttle — six-chiplet combo-die (~$630K NRE), 79-day fab cycle", with SmartSoC (physical
design), PrimeSoC (feasibility reports DGrid-FS-001/002-2026), Terminus Circuits (PHY IP) and
Anamya Technologies (Artix-7 FPGA boards). The reference therefore does not say "130 nm instead of
28 nm". It says both: a **SkyWater 130 nm proof-of-concept tape-out** (products/dg-a100) and the
**TSMC 28 nm SoC2 product die** (about/team), which is what the showcase says.

- **R1 (revised):** keep the showcase's 28 nm SoC2; add the SkyWater 130 nm proof-of-concept step
  and "first silicon in 2026" from the A100 page. No reframing of the portfolio.
- **O4 (revised):** resolved by R1; nothing is waiting on a node decision.
- **Team size:** the team page's 28 engineers (with counts per domain) replaces about/story's "100+".

## New pages from deepgridsemi.com (Software, Use Cases, About, Contact)

Built in `app/company-pages.ts` (each section records the reference page it came from). Left out:
the SDK's Axelera Voyager copy ("AIPUs", "Order Metis!", GitHub download), ADAS "ISO 26262 ASIL-D
compliant" and "sub-10 ms" (contradicted by the measured 35.96 ms), About's "100+", "Founded 2020"
and superlatives, six unsourced awards, and engineers' individual names (shown as counts by domain).
