export const getAcceptanceEmailTemplate = (name, domain) => {
  const templates = {
    'Research Team': `Dear ${name},

Congratulations! You have been selected as a member of the Research Team for TEDxKARE for the Academic Year 2026–2027.

As part of the research team, your role will be to explore ideas from different fields such as science, technology, innovation, education, culture, and social impact. You will help study potential speaker ideas, research their topics, and support the team in identifying meaningful ideas that can be presented on the TEDx stage.

Since you will be working closely with speaker ideas and content, it is very important that you understand the mission and guidelines of TED and TEDx. All research and speaker ideas must follow the official TEDx rules and the principle of “Ideas Worth Spreading.”

Further details regarding meetings and responsibilities will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`,

    'Event Manager': `Dear ${name},

Congratulations! You have been selected as a member of the Event Management Team for TEDxKARE for the Academic Year 2026–2027.

Your role will involve assisting with planning and coordinating the event. You will support venue arrangements, scheduling, event logistics, speaker coordination, and ensuring that the event runs smoothly on the day of the program.

As part of the organizing team, it is important that you understand the mission and rules of TED and TEDx. All event activities must follow the official TEDx guidelines to maintain the global standards of the platform.

Further details about planning meetings and event preparation will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`,

    'Sponsorship & Budget Manager': `Dear ${name},

Congratulations! You have been selected as a member of the Sponsorship Team for TEDxKARE for the Academic Year 2026–2027.

Your role will focus on building partnerships with organizations and sponsors who can support the event. You will work on preparing sponsorship proposals, communicating with potential partners, and helping secure resources required to successfully organize the event.

As a member of the team, it is important to understand the guidelines of TED and TEDx, especially the sponsorship and partnership rules that must be followed for all TEDx events.

More information regarding meetings and responsibilities will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`,

    'Designer': `Dear ${name},

Congratulations! You have been selected as a member of the Design Team for TEDxKARE for the Academic Year 2026–2027.

Your role will involve creating the visual identity of the event. This includes designing posters, banners, social media graphics, stage visuals, and other branding materials that represent the TEDxKARE event.

All designs and branding materials must follow the official design and branding guidelines provided by TED and TEDx. Understanding these guidelines is important to maintain the global visual standards of the platform.

Further details regarding design requirements and tasks will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`,

    'Video Production': `Dear ${name},

Congratulations! You have been selected as a member of the Video & Production Team for TEDxKARE for the Academic Year 2026–2027.

Your role will involve managing the technical production of the event, including camera setup, audio systems, lighting coordination, and recording the talks during the event.

Since TEDx talks are shared globally, it is important that the video production follows the official TED and TEDx production guidelines and standards.

Further instructions and production details will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`,

    'Executive Producer': `Dear ${name},

Congratulations! You have been selected as a member of the Executive Producer Team for TEDxKARE for the Academic Year 2026–2027.

As part of the Executive Producer team, your role will involve overseeing the overall production and planning of the event. You will work closely with different teams to coordinate stage production, technical setup, scheduling, and the overall execution of the event. This role focuses on ensuring that all elements of the event—from stage management to technical operations—are well organized and run smoothly on the day of the program.

As a member of the organizing team, it is important that you understand the mission and guidelines of TED and TEDx. All production and event activities must follow the official TEDx standards and rules to maintain the quality and integrity of the platform.

Further details about responsibilities and coordination meetings will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`,

    'Selection Committee (Curation Team)': `Dear ${name},

Congratulations! You have been selected as a member of the Selection Committee for TEDxKARE for the Academic Year 2026–2027.

As part of the Selection Committee, your role will involve identifying and evaluating potential speakers and ideas for the TEDxKARE event. You will work with the research team to review speaker applications, study their ideas, and help select individuals whose talks present meaningful and impactful ideas across different fields.

This team plays an important role in shaping the content of the event and ensuring that the talks presented on the TEDx stage align with the core principle of sharing “ideas worth spreading.”

As part of the organizing team, it is important to understand the mission and guidelines of TED and TEDx. All speaker selections and talk topics must follow the official TEDx content guidelines.

Further information regarding meetings and the speaker selection process will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`
  };

  if (templates[domain]) {
    return templates[domain];
  }

  // Fallback for domains not explicitly provided (like 'Communications & Marketing Director')
  return `Dear ${name},

Congratulations! You have been selected as a member of the ${domain} for TEDxKARE for the Academic Year 2026–2027.

As a member of the organizing team, it is important that you understand the mission and guidelines of TED and TEDx. All event activities must follow the official TEDx standards and rules to maintain the quality and integrity of the platform.

Further details about responsibilities and coordination meetings will be shared soon.

Best regards,
N. Thrivikram
Organizer – TEDxKARE`;
};
