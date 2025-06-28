import { createServer } from './infrastructure/web/server';
import { Container } from './infrastructure/container';

async function startServer() {
  try {
    const container = Container.getInstance();
    const config = container.getConfig();
    const app = createServer();

    app.listen(config.port, () => {
      console.log(`🚀 Forezy Backend server running on port ${config.port}`);
      console.log(`📱 API available at: http://localhost:${config.port}`);
      console.log(`🏗️  Hexagonal Architecture implemented`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer(); 