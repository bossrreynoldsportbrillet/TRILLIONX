"use strict";
const fs=require("fs"),os=require("os"),cp=require("child_process");
const auto=require("./trillionx_network_autodetect");
const TIMEOUT=Number(process.argv[2]||4000);
const CONCURRENCY=Number(process.argv[3]||10);
const sh=c=>{try{return cp.execSync(c,{encoding:"utf8",stdio:["ignore","pipe","ignore"],timeout:2500}).trim()}catch{return""}};

function interfaces(){
 const n=os.networkInterfaces(),out=[];
 for(const [name,arr] of Object.entries(n))for(const x of arr||[])out.push({name,family:x.family,address:x.address,internal:x.internal,mac:x.mac,cidr:x.cidr});
 return out;
}

(async()=>{
 console.log("=== TRILLIONX BENCH (uses shared autodetect module) ===");
 console.log("NETWORKS:",auto.NETWORKS.length,"TIMEOUT:",TIMEOUT,"CONCURRENCY:",CONCURRENCY);
 const state=await auto.detectAll({timeout:TIMEOUT,concurrency:CONCURRENCY});
 const bench={
  engine:"TRILLIONX_WORLD_NETWORK_AUTODETECT_BENCH",
  version:"3.0-uses-module",
  ts:new Date().toISOString(),
  system:{node:process.version,platform:os.platform(),arch:os.arch(),hostname:os.hostname(),cpus:os.cpus().length,ram_gb:+(os.totalmem()/(2**30)).toFixed(2)},
  network:{interfaces:interfaces(),ip_route:sh("ip route 2>/dev/null || route -n 2>/dev/null")},
  autodetect:state
 };
 const f=`data/trillionx_world_network_autodetect_${Date.now()}.json`;
 fs.writeFileSync(f,JSON.stringify(bench,null,2));
 fs.writeFileSync("data/trillionx_world_network_autodetect_latest.json",JSON.stringify(bench,null,2));
 console.log("OK:",state.summary.ok,"HEALTH:",state.summary.health,"VERDICT:",state.summary.verdict);
 console.log("FACTS EXTRACTED:",Object.keys(state.facts).length);
 console.log("SAMPLE FACTS:",JSON.stringify({btc_height:state.facts.btc_height,btc_usd:state.facts.btc_usd,eth_usd:state.facts.eth_usd,xmr_usd:state.facts.xmr_usd,btc_fee_fast:state.facts.btc_fee_fast,public_ip:state.facts.public_ip}));
 console.log("REPORT =",f);
})().catch(e=>{console.error(e);process.exit(1)});
