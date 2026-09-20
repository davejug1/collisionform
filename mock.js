const forms={
event_information:{title:"Event Information",fields:[
["text","Event response manager"],["text","Location"],
["radio","Was the ADV shut down after detecting the collision?",["Yes","No"]],
["select","Engage mode",["Select an option","Manual","Autonomous"]],
["text","Description of event"],["select","Passenger status",["Select an option","Passenger present","No passenger"]],
["select","Vehicle type",["Select an option","ADV","Other"]],
["radio","Did the ADV move after detecting collision?",["Yes","No"]],
["select","Highest injury severity",["Select an option","None","Non-incapacitating","Incapacitating"]],
["ignored","Run ID"],["ignored","Start time in log"],["ignored","End time in log"]]},
collision_event_details:{title:"Collision Event Details",fields:[
["select","Report Source",["Select an option","Fleet response","Customer","Other"]],
["radio","Was there a reported incapacitating injury?",["Yes","No"]],
["radio","Was there a reported non-incapacitating injury?",["Yes","No"]],
["radio","Did the collision involve contact with a VRU?",["Yes","No"]],
["conditional","If yes, describe the VRU contact"]]},
scene_context:{title:"Scene Context",fields:[
["checkbox","Type of user agent involved",["Pedestrian","Cyclist","Motor vehicle","Other"]],
["radio","Negative media attention",["Yes","No"]],
["radio","Did event occur in depot",["Yes","No"]],
["select","Location type",["Select an option","Road","Car park","Depot","Other"]],
["radio","Was it on private property",["Yes","No"]],
["ignored","Road surface"],["ignored","Type of collision"],["ignored","Lighting"],["ignored","Weather"]]},
"scene_context_-_novelty":{title:"Scene Context – Novelty",fields:[
["radio","Was the ADV stopped or slowing at a traffic control?",["Yes","No"]],
["radio","Was the ADV stopped or slowing for traffic?",["Yes","No"]],
["radio","Was this collision part of a controlled test where the results may have been anticipated?",["Yes","No","Unknown"]],
["radio","Was there anything novel about the scene?",["Yes","No"]],
["radio","Did the event involve a novel traffic situation?",["Yes","No"]],
["radio","Was the ADV responding to an unusual road configuration?",["Yes","No"]],
["radio","Was there an unusual interaction with another road user?",["Yes","No"]],
["radio","Was the event otherwise considered novel?",["Yes","No"]]}
};

const root=document.getElementById("formRoot"),nav=document.getElementById("sectionNav");
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

function fieldHTML(f){
 const [type,label,opts]=f,id="mock-"+slug(label);
 if(type==="ignored")return `<div class="field ignored-field"><label>${label}</label><input type="text" placeholder="Ignored by guidance layer"></div>`;
 if(type==="conditional")return `<div class="field conditional-field" data-conditional hidden><label for="${id}">${label}</label><textarea id="${id}"></textarea></div>`;
 if(type==="text")return `<div class="field" data-trackable><label for="${id}">${label}</label><input id="${id}" type="text"></div>`;
 if(type==="select")return `<div class="field" data-trackable><label for="${id}">${label}</label><select id="${id}">${opts.map((o,i)=>`<option value="${i?o:""}">${o}</option>`).join("")}</select></div>`;
 if(type==="radio")return `<fieldset class="field" data-trackable><legend>${label}</legend>${opts.map(o=>`<label class="option"><input type="radio" name="${id}" value="${o}"> ${o}</label>`).join("")}</fieldset>`;
 if(type==="checkbox")return `<fieldset class="field" data-trackable><legend>${label}</legend>${opts.map(o=>`<label class="option"><input type="checkbox" name="${id}" value="${o}"> ${o}</label>`).join("")}</fieldset>`;
}

function render(section){
 const f=forms[section]; root.dataset.section=section;
 root.innerHTML=`<div class="section-header"><div><div class="eyebrow">SECTION</div><h2>${f.title}</h2><p>This offline mock intentionally keeps all four sections visible in the sidebar and behaves like a single-page form.</p></div><div class="section-url">?section=${section}</div></div><form>${f.fields.map(fieldHTML).join("")}<div class="actions"><button type="button" id="nextSection">Next section</button></div></form>`;
 // Mock conditional behaviour: VRU = Yes exposes an additional description field.
 const radios=[...root.querySelectorAll("input[type=radio]")];
 const vru=radios.find(x=>x.name.includes("collision-involve-contact-with-a-vru"));
 if(vru){
   radios.filter(x=>x.name===vru.name).forEach(x=>x.addEventListener("change",()=>{
     const box=root.querySelector("[data-conditional]");
     if(box) box.hidden=!root.querySelector(`input[name="${vru.name}"][value="Yes"]`).checked;
   }));
 }
 root.querySelector("#nextSection").onclick=()=>{
   const keys=Object.keys(forms),i=keys.indexOf(section),next=keys[(i+1)%keys.length];
   history.replaceState({}, "", "?section="+next); render(next); updateNav(next);
 };
}
function updateNav(section){nav.querySelectorAll(".section-link").forEach(b=>b.classList.toggle("active",b.dataset.section===section));}
nav.onclick=e=>{const b=e.target.closest(".section-link");if(!b)return;const s=b.dataset.section;history.replaceState({}, "", "?section="+s);render(s);updateNav(s);}
const initial=new URLSearchParams(location.search).get("section")||"event_information";
render(forms[initial]?initial:"event_information");
