#!/bin/bash

echo "🔧 Setting up fork and remotes for contributing back..."
echo ""

# Add upstream remote
echo "📌 Adding upstream remote..."
git remote add upstream https://github.com/tanker327/prompts-mcp-server.git

# Verify remotes
echo ""
echo "✓ Current remotes:"
git remote -v

# Fetch upstream
echo ""
echo "📥 Fetching upstream branches..."
git fetch upstream

# Create feature branches
echo ""
echo "🌿 Creating feature branches..."

# Create branch for enhanced tool descriptions
git checkout -b feature/enhanced-tool-descriptions
echo "✓ Created: feature/enhanced-tool-descriptions"

# Create branch for GitHub integration  
git checkout -b feature/github-integration
echo "✓ Created: feature/github-integration"

# Create branch for advanced search
git checkout -b feature/advanced-search
echo "✓ Created: feature/advanced-search"

# Create branch for prompt composition
git checkout -b feature/prompt-composition
echo "✓ Created: feature/prompt-composition"

# Return to main branch
git checkout main
echo ""
echo "✓ Returned to main branch"

echo ""
echo "🎉 Setup complete! Your branches are ready:"
git branch

echo ""
echo "📋 Next steps:"
echo "1. Post the issue to the original repository"
echo "2. Wait for maintainer response"
echo "3. Prepare the first PR based on feedback"
echo ""
echo "💡 To start working on a feature:"
echo "   git checkout feature/enhanced-tool-descriptions"