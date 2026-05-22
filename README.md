# BountyScope

> Bug-bounty intel + on-demand AI smart-contract analysis.

**Live:** https://bountyscope.ivixivi.workers.dev

BountyScope tracks the top Immunefi DeFi programs (Uniswap V4 $15.5M, MakerDAO/Sky $5M,
Lido $2M, Morpho $2.5M, Optimism $2M, …), polls each program for code changes via HEAD
requests every 30 min, and exposes an AI smart-contract analyzer that flags reentrancy,
access control issues, integer overflow, and other high-severity patterns.

Attacker-side complement to [VulnPulse](https://vulnpulse.ivixivi.workers.dev) (defender-side CVE feed).

## API

```
GET  /api/programs          — Tracked Immunefi programs (severity caps, in-scope repos)
POST /api/analyze           — Analyze a Solidity snippet for known vuln patterns
GET  /api/changes           — Recent program/repo changes (HEAD diffs)
GET  /api/status            — System health
```

## Pricing

| Tier  | Price    | What's included                                          |
|-------|----------|----------------------------------------------------------|
| Free  | $0       | Public program list + 5 analyzer calls/day              |
| Pro   | $49/mo   | Unlimited analyzer calls + change alerts + priority NVD |
| Team  | $199/mo  | Custom watchlist + Slack/Discord webhooks + SLA         |

**Pay any rail:** GitHub Sponsors, crypto, BMC, latent Stripe.

## Stack

- Cloudflare Workers (compute + cron)
- Cloudflare Workers AI — Llama 3.3 70B for contract analysis
- Cloudflare KV — program registry + report cache

## Sister products

BountyScope is part of an intelligence portfolio:

- [PromptScope](https://promptscope.ivixivi.workers.dev) — LLM system-prompt analyzer
- [EdgarFlash](https://edgarflash.ivixivi.workers.dev) — Real-time SEC EDGAR alerts
- [WriteLens](https://writelens.ivixivi.workers.dev) — Pay-per-call text quality scoring
- [TrendPulse](https://trendpulse.ivixivi.workers.dev) — Daily emerging-tech digest
- [VulnPulse](https://vulnpulse.ivixivi.workers.dev) — Defender-side CVE feed

## License

MIT — see [LICENSE](./LICENSE).
