FROM node:24

WORKDIR /home/app

RUN apt-get update 
RUN apt-get install -y vim

COPY . /home/app

RUN git clone https://github.com/jezweb/smart-prompts-mcp.git
WORKDIR /home/app/smart-prompts-mcp
RUN npm cache clean --force
RUN npm install
RUN npm run build 
RUN ./verify-install.sh
COPY ./dotenv.txt .env

# Install mcp-proxy globally
RUN npm install -g mcp-proxy

# Expose the proxy port
EXPOSE 8080

# Start mcp-proxy with your MCP server
CMD ["mcp-proxy", "--host=0.0.0.0", "--port=8080", "node", "/home/app/smart-prompts-mcp/dist/index.js"]



