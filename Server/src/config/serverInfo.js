import env from './env.js';

export const serverInfo = {
    name: 'BloodWeb Server',
    version: '2.0.0beta',
    description: 'Backend API server for the BloodWeb real-time blood donation platform.',
    about: 'BloodWeb is a real-time emergency blood donation coordination platform designed to bridge the critical gap between patients in urgent need and verified nearby donors.',
    links: {
        github: 'https://github.com/codenamann/BloodWeb',
        documentation: 'https://github.com/codenamann/BloodWeb#readme',
        website: env.app.frontendUrl || 'http://localhost:3000',
    },
};

export default serverInfo;
