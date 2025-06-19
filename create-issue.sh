#!/bin/bash

echo "📝 Creating issue on the original repository..."
echo ""
echo "This script will help you create the issue to propose your enhancements."
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo ""
    echo "To create the issue manually:"
    echo "1. Go to: https://github.com/tanker327/prompts-mcp-server/issues/new"
    echo "2. Copy the content from ISSUE_DRAFT.md"
    echo "3. Paste and submit"
    echo ""
    echo "Or install GitHub CLI:"
    echo "  brew install gh  (on macOS)"
    echo "  sudo apt install gh  (on Ubuntu)"
    exit 1
fi

echo "✓ GitHub CLI found"
echo ""

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub first:"
    gh auth login
fi

echo ""
echo "📋 Issue Details:"
echo "Repository: tanker327/prompts-mcp-server"
echo "Title: Enhancement Proposal: GitHub Integration and Advanced Features for prompts-mcp-server"
echo ""

read -p "Ready to create the issue? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating issue..."
    
    # Create the issue using the content from ISSUE_DRAFT.md
    ISSUE_BODY=$(cat ISSUE_DRAFT.md | sed '1,2d')  # Skip the first two lines
    
    gh issue create \
        --repo tanker327/prompts-mcp-server \
        --title "Enhancement Proposal: GitHub Integration and Advanced Features for prompts-mcp-server" \
        --body "$ISSUE_BODY"
    
    echo ""
    echo "✅ Issue created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Monitor the issue for responses"
    echo "2. Answer any questions from the maintainer"
    echo "3. Prepare PRs based on their feedback"
else
    echo ""
    echo "Issue creation cancelled."
    echo ""
    echo "To create manually:"
    echo "1. Go to: https://github.com/tanker327/prompts-mcp-server/issues/new"
    echo "2. Copy content from ISSUE_DRAFT.md"
    echo "3. Submit the issue"
fi