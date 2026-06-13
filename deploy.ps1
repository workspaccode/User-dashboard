# ======================================================
# Brillance — Deploy Guide
# ======================================================
#
# Prerequisites:
#   1. Stripe account → Products → Create Pro ($19/mo) + Team ($49/mo)
#   2. Supabase project → Settings → API → Copy URL + Anon Key
#   3. OpenAI API key
#
# Usage:
#   .\deploy.ps1
# ======================================================

Write-Host "🚀 Brillance Deploy" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

# ---- Frontend → Vercel ----
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  Step 1: Deploy Frontend to Vercel       ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd 'D:\Idea-SAAS\User dashboard'" -ForegroundColor Green
Write-Host "  npx vercel deploy --prod" -ForegroundColor Green
Write-Host ""
Write-Host "  Set env vars on Vercel:" -ForegroundColor Cyan
Write-Host "  - VITE_SUPABASE_URL" -ForegroundColor White
Write-Host "  - VITE_SUPABASE_ANON_KEY" -ForegroundColor White
Write-Host "  - VITE_STRIPE_PUBLISHABLE_KEY" -ForegroundColor White
Write-Host ""

# ---- Backend → Railway ----
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  Step 2: Deploy Backend to Railway        ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd 'D:\Idea-SAAS\User dashboard\backend'" -ForegroundColor Green
Write-Host "  railway login" -ForegroundColor Green
Write-Host "  railway init" -ForegroundColor Green
Write-Host "  railway up" -ForegroundColor Green
Write-Host ""
Write-Host "  Set env vars on Railway:" -ForegroundColor Cyan
Write-Host "  - SUPABASE_URL" -ForegroundColor White
Write-Host "  - SUPABASE_KEY" -ForegroundColor White
Write-Host "  - OPENAI_API_KEY" -ForegroundColor White
Write-Host "  - STRIPE_SECRET_KEY" -ForegroundColor White
Write-Host "  - STRIPE_WEBHOOK_SECRET" -ForegroundColor White
Write-Host "  - STRIPE_PRO_PRICE_ID" -ForegroundColor White
Write-Host "  - STRIPE_TEAM_PRICE_ID" -ForegroundColor White
Write-Host "  - FRONTEND_URL" -ForegroundColor White
Write-Host ""

# ---- Stripe Webhook ----
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  Step 3: Configure Stripe Webhook         ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Go to https://dashboard.stripe.com/webhooks" -ForegroundColor Cyan
Write-Host "  2. Add endpoint: https://YOUR-RAILWAY-URL.railway.app/stripe/webhook" -ForegroundColor White
Write-Host "  3. Events to listen:" -ForegroundColor Cyan
Write-Host "     - checkout.session.completed" -ForegroundColor White
Write-Host "     - customer.subscription.updated" -ForegroundColor White
Write-Host "     - customer.subscription.deleted" -ForegroundColor White
Write-Host "  4. Copy Webhook Secret → set as STRIPE_WEBHOOK_SECRET" -ForegroundColor Cyan
Write-Host ""

# ---- Update vercel.json ----
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  Step 4: Update Vercel Rewrites           ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Edit vercel.json — replace 'brillance-api.railway.app'" -ForegroundColor Cyan
Write-Host "  with your actual Railway backend URL" -ForegroundColor White
Write-Host ""

# ---- Test ----
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  Step 5: Test Production Flow             ║" -ForegroundColor Yellow
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""
Write-Host "  ✓ Landing page loads" -ForegroundColor Green
Write-Host "  ✓ Auth (Supabase) works" -ForegroundColor Green
Write-Host "  ✓ HTML file upload → components" -ForegroundColor Green
Write-Host "  ✓ SVG file upload → components" -ForegroundColor Green
Write-Host "  ✓ Flutter code generation" -ForegroundColor Green
Write-Host "  ✓ Design System generation + export" -ForegroundColor Green
Write-Host "  ✓ Stripe checkout → Pro upgrade" -ForegroundColor Green
Write-Host "  ✓ Limits enforced pre-upgrade" -ForegroundColor Green
Write-Host "  ✓ Limits removed post-upgrade" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Done! Brillance is live." -ForegroundColor Green
