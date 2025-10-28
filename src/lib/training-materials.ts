export type TrainingMaterial = {
  id: string;
  title: string;
  description: string;
  example: string;
  tip: string;
  identifiers: string[];
};

export const TRAINING_MATERIALS: TrainingMaterial[] = [
  {
    id: 'phishing',
    title: 'Phishing / Pretexting',
    description: 'Phishing attacks use deceptive emails, websites, or messages to trick you into revealing sensitive information like passwords or financial details. Pretexting is the practice of presenting oneself as someone else to obtain private information.',
    example: "You receive an email from 'Netflix' stating your account is on hold. It asks you to click a link and re-enter your payment details. The link leads to 'netflx.co' instead of 'netflix.com'.",
    tip: 'Always verify HR requests, password resets, and financial communications by navigating to the official company intranet or contacting the sender through a known, trusted channel. Hover over links to inspect the URL before clicking.',
    identifiers: ['Suspicious Links', 'Urgent Tone', 'Generic Greetings', 'Requests for Credentials'],
  },
  {
    id: 'whaling-smishing',
    title: 'Whaling & Smishing',
    description: "Whaling is a highly targeted phishing attack aimed at senior executives. Smishing is phishing conducted over SMS text messages. Both often rely on impersonation and urgency.",
    example: 'You get a text: "Hi, it\'s the CEO. I\'m in a meeting and need you to buy gift cards for a client ASAP. Text me the codes when you have them."',
    tip: 'Verify any unusual financial or data requests, especially for gift cards or wire transfers, through a different communication method (e.g., a direct phone call to a known number). Be extra suspicious of requests from a mobile number.',
    identifiers: ['Impersonation of Authority', 'Urgent Financial Request', 'Unusual Channel (SMS)', 'Gift Card Scam'],
  },
  {
    id: 'impersonation-scam',
    title: 'Impersonation / Tech Support Scam',
    description: 'Attackers pretend to be someone trustworthy, like IT support or a colleague, to gain your trust and convince you to perform an action, such as granting remote access or disabling security features.',
    example: 'A chat message pops up from "IT-Helpdesk": "We have detected a virus on your device. Please download and run this tool immediately to remove it."',
    tip: 'Never grant remote access or install software from an unsolicited contact. Always call the official IT helpdesk number provided by your company to verify the request is legitimate.',
    identifiers: ['Unsolicited Help', 'Remote Access Request', 'Software Download', 'Impersonation of IT'],
  },
  {
    id: 'vishing',
    title: 'Vishing (Voice Phishing)',
    description: 'Vishing uses phone calls (live or automated) to trick individuals into divulging personal or financial information. The caller often creates a sense of urgency or fear.',
    example: 'An automated call claims to be from your bank, reporting "suspicious activity." It asks you to enter your account number and PIN to verify your identity.',
    tip: 'If you receive a suspicious call from a bank or service provider, hang up. Call the official number listed on their website or on the back of your card to verify the alert.',
    identifiers: ['Unsolicited Phone Call', 'Request for PIN/Password', 'Urgency/Fear', 'Automated Voice'],
  },
  {
    id: 'baiting',
    title: 'Baiting',
    description: 'Baiting uses a free item or curiosity to entice victims into an insecure action. The classic example is leaving an infected USB drive in a public place, labeled "Salaries Q4".',
    example: 'You find a USB drive labeled "Confidential" in the office parking lot. Plugging it in could install malware on your computer.',
    tip: 'Never plug untrusted media (like a found USB drive) into your computer. Report any found devices to your IT or security department.',
    identifiers: ['"Free" Item', 'Curiosity', 'Physical Media', 'Malware Threat'],
  },
    {
    id: 'tailgating',
    title: 'Tailgating / Piggybacking',
    description: 'This is a physical security breach where an unauthorized person follows an authorized individual into a secure area. They often rely on social pressure or politeness to succeed.',
    example: 'Someone carrying boxes asks you to hold the door to the office because their access card is packed away. Letting them in bypasses security.',
    tip: 'Be polite but firm. Always require visitors or unknown individuals to go through the proper check-in process at reception. Do not hold secure doors open for others.',
    identifiers: ['Physical Entry', 'Exploiting Politeness', 'No Visible ID/Pass', 'Sense of Urgency'],
  },
  {
    id: 'scareware',
    title: 'Scareware / Watering Hole',
    description: 'Scareware uses pop-ups that look like system warnings to frighten you into downloading malware. A Watering Hole attack compromises a legitimate website frequented by a target group to deliver this malware.',
    example: 'While browsing a news site, a pop-up with your company\'s logo appears: "WARNING: Your system is infected! Click here to run our corporate antivirus scan!"',
    tip: 'Only install software and updates from official IT department channels. Ignore urgent pop-ups on external websites, even if they use familiar logos. Close the tab or browser if you cannot close the pop-up.',
    identifiers: ['Alarming Pop-ups', 'Fake Warnings', 'Unexpected Software Offer', 'Impersonation on 3rd Party Site'],
  },
];
