export type OfficialSource = "GOV.UK" | "legislation.gov.uk" | "IPSEA";

export type OfficialLink = {
  href: string;
  title: string;
  source: OfficialSource;
  note: string;
};

export type RightsSection = {
  id: string;
  title: string;
  useWhen: string;
  links: OfficialLink[];
};

export const RIGHTS_SECTIONS: RightsSection[] = [
  {
    id: "children-and-families-act",
    title: "Children and Families Act 2014",
    useWhen:
      "you need the law behind special educational needs, EHC needs assessments, and education, health and care (EHC) plans in England.",
    links: [
      {
        href: "https://www.legislation.gov.uk/ukpga/2014/6/part/3",
        title: "Part 3 — children and young people with SEND",
        source: "legislation.gov.uk",
        note: "The SEND and EHC rules for England sit in this part of the Act.",
      },
      {
        href: "https://www.legislation.gov.uk/ukpga/2014/6/section/36",
        title: "Section 36 — asking for an EHC needs assessment",
        source: "legislation.gov.uk",
        note: "A parent, young person, or school can ask the local authority to assess.",
      },
      {
        href: "https://www.gov.uk/children-with-special-educational-needs/extra-SEN-help",
        title: "Extra help, including EHC plans",
        source: "GOV.UK",
        note: "Plain-English steps for asking your council for an assessment.",
      },
      {
        href: "https://www.ipsea.org.uk/asking-for-an-ehc-needs-assessment",
        title: "Asking for an EHC needs assessment",
        source: "IPSEA",
        note: "A trusted parent guide that points back to the legal test.",
      },
    ],
  },
  {
    id: "send-code-of-practice",
    title: "SEND Code of Practice 2015",
    useWhen:
      "you want the official guidance schools, councils and the Tribunal must have regard to — and a parent-facing overview of the SEND system.",
    links: [
      {
        href: "https://www.gov.uk/government/publications/send-code-of-practice-0-to-25",
        title: "SEND code of practice: 0 to 25 years",
        source: "GOV.UK",
        note: "Statutory guidance. Last updated on GOV.UK in September 2024; the Code itself is the January 2015 version.",
      },
      {
        href: "https://www.gov.uk/children-with-special-educational-needs",
        title: "Children with SEND — GOV.UK guide",
        source: "GOV.UK",
        note: "The current parent hub: SEN support, extra help, and who to talk to.",
      },
      {
        href: "https://www.gov.uk/government/publications/send-guide-for-parents-and-carers",
        title: "SEND: guide for parents and carers",
        source: "GOV.UK",
        note: "A Department for Education booklet to read alongside the Code.",
      },
      {
        href: "https://www.ipsea.org.uk/faqs/send-code-of-practice",
        title: "What the Code means in practice",
        source: "IPSEA",
        note: "Short parent explainer: “must” is a legal duty; “should” is guidance.",
      },
    ],
  },
  {
    id: "equality-act",
    title: "Equality Act 2010",
    useWhen:
      "your child is disabled, and you need the law on discrimination, reasonable adjustments, or education rights — this sits alongside SEND duties, not instead of them.",
    links: [
      {
        href: "https://www.legislation.gov.uk/ukpga/2010/15/section/20",
        title: "Section 20 — duty to make reasonable adjustments",
        source: "legislation.gov.uk",
        note: "The core duty to take reasonable steps so a disabled person is not substantially disadvantaged.",
      },
      {
        href: "https://www.legislation.gov.uk/ukpga/2010/15/section/85",
        title: "Section 85 — pupils in schools",
        source: "legislation.gov.uk",
        note: "How the Act applies to admission, education, and exclusion in schools.",
      },
      {
        href: "https://www.gov.uk/rights-disabled-person/education-rights",
        title: "Disability and education rights",
        source: "GOV.UK",
        note: "Parent-facing overview of education rights under the Equality Act.",
      },
      {
        href: "https://www.gov.uk/government/publications/equality-act-2010-advice-for-schools",
        title: "Equality Act 2010: advice for schools",
        source: "GOV.UK",
        note: "Department for Education advice on how the Act applies in schools.",
      },
    ],
  },
  {
    id: "school-duties",
    title: "School duties",
    useWhen:
      "you want what schools should be doing on SEN support, the SENCO, or the SEN information report — before or after an EHC plan.",
    links: [
      {
        href: "https://www.gov.uk/children-with-special-educational-needs/special-educational-needs-support",
        title: "SEN support in school or nursery",
        source: "GOV.UK",
        note: "What extra help in school can look like, and who to speak to first.",
      },
      {
        href: "https://www.gov.uk/government/publications/send-guide-for-schools-and-alternative-provision-settings",
        title: "SEND: guide for schools and alternative provision",
        source: "GOV.UK",
        note: "Official DfE guide to school SEND duties under the Code of Practice.",
      },
      {
        href: "https://www.gov.uk/government/publications/sen-and-disability-duties-guidance-for-school-governing-boards",
        title: "SEN and disability duties for school governing boards",
        source: "GOV.UK",
        note: "Current DfE guidance (2025) on what governors and trustees should oversee.",
      },
      {
        href: "https://www.legislation.gov.uk/ukpga/2014/6/section/66",
        title: "Section 66 — using best endeavours to secure SEN provision",
        source: "legislation.gov.uk",
        note: "The school’s duty to use its best endeavours to meet special educational needs.",
      },
    ],
  },
  {
    id: "local-authority",
    title: "Local authority and council duties",
    useWhen:
      "you need what your council must publish, who can advise you, or the duty to put in place the help named in an EHC plan.",
    links: [
      {
        href: "https://www.gov.uk/find-local-council",
        title: "Find your local council",
        source: "GOV.UK",
        note: "Start here, then search the council site for “Local Offer” or SENDIASS.",
      },
      {
        href: "https://www.legislation.gov.uk/ukpga/2014/6/section/30",
        title: "Section 30 — the Local Offer",
        source: "legislation.gov.uk",
        note: "Councils must publish what SEND help they expect to be available.",
      },
      {
        href: "https://www.legislation.gov.uk/ukpga/2014/6/section/32",
        title: "Section 32 — advice and information",
        source: "legislation.gov.uk",
        note: "Councils must arrange impartial information, advice and support (often called SENDIASS).",
      },
      {
        href: "https://www.legislation.gov.uk/ukpga/2014/6/section/42",
        title: "Section 42 — securing the help in an EHC plan",
        source: "legislation.gov.uk",
        note: "If a plan names special educational provision, the council must secure it.",
      },
      {
        href: "https://www.legislation.gov.uk/uksi/2014/1530/contents",
        title: "SEND Regulations 2014",
        source: "legislation.gov.uk",
        note: "The detailed rules that sit under the 2014 Act, including timescales.",
      },
    ],
  },
  {
    id: "complaints-and-tribunal",
    title: "Complaints, disagreement resolution, and the SEND Tribunal",
    useWhen:
      "talking has not worked, you disagree with an EHC decision, or you think a school has discriminated because of disability.",
    links: [
      {
        href: "https://www.gov.uk/complain-about-school/sen-complaints",
        title: "Complain about a school’s SEN support",
        source: "GOV.UK",
        note: "Start with the SENCO, then the school’s complaints process. Councils may also offer disagreement resolution.",
      },
      {
        href: "https://www.gov.uk/complain-about-school/disability-discrimination",
        title: "Complain about disability discrimination at school",
        source: "GOV.UK",
        note: "How a disability discrimination claim to the SEND Tribunal works.",
      },
      {
        href: "https://www.gov.uk/appeal-ehc-plan-decision",
        title: "Appeal an EHC plan decision",
        source: "GOV.UK",
        note: "When you can appeal a local authority decision about an EHC assessment or plan.",
      },
      {
        href: "https://www.gov.uk/appeal-ehc-plan-decision/before-you-appeal",
        title: "Mediation before you appeal",
        source: "GOV.UK",
        note: "In most cases you must consider mediation and get a certificate first.",
      },
      {
        href: "https://www.gov.uk/courts-tribunals/first-tier-tribunal-special-educational-needs-and-disability",
        title: "First-tier Tribunal (SEND)",
        source: "GOV.UK",
        note: "The official Tribunal page: EHC appeals and disability discrimination claims.",
      },
      {
        href: "https://www.ipsea.org.uk/what-is-the-send-tribunal",
        title: "What is the SEND Tribunal?",
        source: "IPSEA",
        note: "A calm parent explainer of what the Tribunal can and cannot do.",
      },
    ],
  },
  {
    id: "attendance-and-mental-health",
    title: "Attendance and mental health",
    useWhen:
      "your child is struggling to attend because of SEND, anxiety, or other health needs — and you need the official attendance and education-at-home guidance.",
    links: [
      {
        href: "https://www.gov.uk/government/publications/working-together-to-improve-school-attendance",
        title: "Working together to improve school attendance",
        source: "GOV.UK",
        note: "Statutory attendance guidance. It includes extra support and reasonable adjustments for pupils with SEND.",
      },
      {
        href: "https://www.gov.uk/government/publications/mental-health-issues-affecting-a-pupils-attendance-guidance-for-schools",
        title: "Mental health issues affecting a pupil’s attendance",
        source: "GOV.UK",
        note: "DfE guidance where social, emotional or mental health needs affect going into school.",
      },
      {
        href: "https://www.gov.uk/government/publications/education-for-children-with-health-needs-who-cannot-attend-school",
        title: "Education for children with health needs who cannot attend school",
        source: "GOV.UK",
        note: "Statutory guidance on the council’s duty when a child is too ill to attend.",
      },
    ],
  },
];
