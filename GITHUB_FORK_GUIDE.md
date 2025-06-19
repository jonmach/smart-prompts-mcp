# 🍴 GitHub Fork Visual Guide

## Step 1: Fork the Repository

1. **Navigate to**: https://github.com/tanker327/prompts-mcp-server

2. **Click the Fork button** (top right):
   ```
   ⭐ Star  👁️ Watch  🍴 Fork
                         ^^^^^^ Click this
   ```

3. **Fork dialog appears**:
   - Owner: Select `jezweb` (your account)
   - Repository name: Keep as `prompts-mcp-server`
   - Description: Optional (can keep original)
   - ✅ Copy the main branch only
   - Click **"Create fork"**

4. **Wait for fork creation** (few seconds)

5. **You'll be redirected to**: 
   - `https://github.com/jezweb/prompts-mcp-server`
   - This is YOUR fork!

## Step 2: Verify Your Fork

Your fork should show:
```
jezweb/prompts-mcp-server
forked from tanker327/prompts-mcp-server
```

## Step 3: Clone Your Fork (Optional)

If you want a separate clone of just the original:
```bash
# Create a separate directory
mkdir -p ~/claude/prompts/original-fork
cd ~/claude/prompts/original-fork

# Clone your fork
git clone https://github.com/jezweb/prompts-mcp-server.git
cd prompts-mcp-server
```

## Step 4: What We'll Do Next

After you fork:
1. ✅ Run `./setup-fork.sh` in your smart-prompts-mcp directory
2. ✅ This will set up all the git remotes and branches
3. ✅ Then we'll create the issue
4. ✅ And prepare your first PR!

## 📝 Important Notes

- **Don't worry about mistakes** - You can always delete and re-fork
- **Your fork is independent** - Changes won't affect the original until you PR
- **Keep your fork updated** - We'll sync with upstream regularly
- **PRs go from your fork** - Not from your smart-prompts-mcp repo

## 🎯 After Forking Checklist

- [ ] Fork shows in your GitHub account
- [ ] Fork shows "forked from tanker327/prompts-mcp-server"  
- [ ] You can see the code in your fork
- [ ] Ready to run setup-fork.sh

Let me know when you've completed the fork!