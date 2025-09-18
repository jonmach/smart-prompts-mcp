# Run with environment variables
docker run --rm -d \
  --name smart-prompts-server \
  -p 8080:8080 \
  -e GITHUB_OWNER=<repo owner here> \
  -e GITHUB_REPO=<your repo here> \
  -e GITHUB_TOKEN=<your token here>\
  smart-prompts-with-proxy

