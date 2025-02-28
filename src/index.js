/**
 * api gladiator
 * main app entry point for programmatic usage
 */

import express from 'express';
import { configureAWS } from './config/aws';
import pkg from '../package.json';

const app = express();
const port = process.env.PORT || 3000;

// init aws configurations
configureAWS();

// basic api routes for potential future expansion
app.get('/', (req, res) => {
    res.json({
        name: 'api gladiator', 
        version: pkg.version,
        description: 'Test endpoints head 2 head'
    });
});

// only start server if this file is run directly, not when imported
if (require.main === module) {
    app.listen(port, () => {
        console.log(`api gladiator server running on port ${port}`);
    });
}

export default app;