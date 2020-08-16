# HandyDNS_Bot
**HandyShake Telegram Bot**

![Handy](./Handy.png)

This project is for **Build An Application With Handshake** hackathon.

HandyDNS_Bot is a telegram bot that will give domain name information from the Handshake network. The initial inspiration of the project was to provide DNS records for domains from the Name Base API:
`/api/v0/dns/domains/:domain`, but that information only appears to be available if the owner queries the record.

The idea of a telegram bot to give domain information was still compelling but without public facing APIs, the challenge increased quite a bit. 

The next step was researching the `hsd` RCP calls.  The information was available by the node, just not for public consumption. The documentation was suprisingly helpful, and the examples presented a clear solution. The calls in question seem to be `getnameinfo` and `getnameresource`. The fact that this information was available, but only from these RPC calls led to running the `hsd` along with the bot. There was a bit of massaging to get the node running along with the bot service, but NodeJS makes things *just* work quite nicely.

Check out a **video** demonstration:
<iframe src="https://player.vimeo.com/video/448245155" width="640" height="335" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

Shout out to `@ltfschoen` in the discord for that `getnameresource` RPC.