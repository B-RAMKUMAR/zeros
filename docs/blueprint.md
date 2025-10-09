# **App Name**: ZEROS Launchpad

## Core Features:

- Landing Page: Display Playbook module, Program Onboarding module, and Login button.
- Role-Based Login: Secure login page with role-based authentication (Program Orchestrator, Program Operator, Scorer, Apprentice Zeros).
- Playbook Display: Display the ZEROS Program playbook content, including phases, objectives, and weekly schedules.
- Terms Acceptance and Access Request: Apprentice Zeros can accept terms and request access; Program Orchestrator approves requests.
- Personalized Dashboard: Each user role has a specific dashboard with access permissions for tasks, submissions, scoring, announcements, requests, and user profile data.
- Automated Journal Entry Generation: Uses generative AI to create personalized daily journal entries, integrating relevant data points such as recent tasks, team interactions, and current skill development focuses, fostering structured self-reflection and documentation, the LLM will use a tool to extract information from task progress, meeting summaries, and skills data, and create an adaptive summary. The LLM will synthesize a thoughtful entry which should contain key insights and discoveries, which also takes into account areas where you have been improving lately and future focus. Entries should follow common diary styles (paragraphs) but be structured to be exported to formats readable by standard journal software.
- Countdown Timer: Display a countdown timer for task deadlines (ETA) on the Apprentice Zeros dashboard.
- Dynamic UI: All UI elements on dashboards are created using information stored in markdown format. To demonstrate that the dynamic UI is configurable by non-programmers, create some sample markdown documents in the file structure inside the repository in /samplemd/ folder to generate all data.
- Deliverable Submission: Apprentice Zeros can upload deliverables for tasks.
- Scorer Module: Scorers can view uploaded tasks, download files, and provide scores.
- Task Management: Tasks are managed with a specific format and auto-close after ETA.
- People Management: Add new users with role-based access.
- Announcement & Requests: Orchestrator sends announcements, and Apprentice Zeros send join requests.
- Score Management: Display average scores per apprentice and per task.

## Style Guidelines:

- The color palette is based on the existing Mu Sigma brand colors, with emphasis on conveying both innovation and trust. Dark color scheme. Primary color: Mu Sigma Blue (#0077C8). The blue represents intelligence, focus, and forward-thinking.
- Background color: Dark gray (#222222) for a sophisticated and modern feel.
- Accent color: Bright yellow (#FFDA63) is analogous to blue, and will highlight key interactive elements and CTAs to guide the user.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern and neutral look.
- Use a set of clean, geometric icons, sourced from a library like FontAwesome or Material Icons. These icons should visually represent each module and function within the platform (e.g., a calendar for deadlines, a file for submissions, a chart for analytics).
- Implement a grid-based layout with clear divisions for each module and section. Use consistent padding and margins to maintain visual consistency across the platform. The layout should be responsive.
- Add subtle transitions and animations to enhance user experience, such as loading animations and smooth transitions between pages.