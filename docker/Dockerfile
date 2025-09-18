FROM node:24

WORKDIR /home/app

RUN apt-get update 
RUN apt-get install -y vim 

WORKDIR /home/app

COPY . /home/app

# Install UV
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin/:$PATH"

#
# First install the MCP Proxy to allow SSE transport
#

RUN uv tool install git+https://github.com/jonmach/mcp-proxy --reinstall

#
# Now the Smart-Prompts Service
#

RUN git clone https://github.com/jonmach/smart-prompts-mcp
WORKDIR /home/app/smart-prompts-mcp

RUN npm cache clean --force
RUN npm install
RUN npm run build 
RUN ./verify-install.sh
COPY ./mydotenv.txt /home/app/.env

WORKDIR /home/app

# Expose the proxy port
EXPOSE 8080

#CMD ["tail", "-f", "/dev/null"]

# Start mcp-proxy with your MCP server
#CMD ["mcp-proxy", "--pass-environment", "--host=0.0.0.0", "--debug", "--port=8080", "node", "/home/app/smart-prompts-mcp/dist/index.js"]
CMD ["mcp-proxy", "--host=0.0.0.0", "--debug", "--port=8080", "node", "/home/app/smart-prompts-mcp/dist/index.js"]



