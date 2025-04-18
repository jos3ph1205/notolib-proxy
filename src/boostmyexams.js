export default function boostMyExams() {
	return `
		(async () => {
		 const loadScript = src =>
				new Promise((res, rej) => {
					 const s = document.createElement("script");
					 s.src = src;
					 s.onload = res;
					 s.onerror = rej;
					 document.head.appendChild(s);
				});

		 // REQUIREMENTS

		 if (window.__BOOSTMYEXAMS_RAN__) {
				toast("Already running", "alert");
				return;
		 }
		 window.__BOOSTMYEXAMS_RAN__ = true;
		 toast("Running!", "success");

		 // STYLES
		 if (!document.querySelector("#BoostMyExams_Style")) {
				const style = \`
				<style id="BoostMyExams_Style">
					 [class*='StaticBanner_banner'] {
							display: none !important;
					 }
					 .Wrapper_wrapper__raXe4:has(> div > div[class*='FeatureSliderCTA_container__UFYyV']) {
							display: none !important;
					 }
					 .boostmyexams_refreshBtn > svg {
							transition: rotate .15s ease-out;
					 }
					 .boostmyexams_refreshBtn:hover > svg {
							rotate: 45deg;
					 }
					 .boostmyexams_refreshBtn:active > svg {
							rotate: 75deg;
					 }
					 .boostmyexams_toast {
							display: block !important;
							position: fixed;
							bottom: 1rem;
							right: 1rem;
							padding: 1rem !important;
							border: solid rgb(66,66,66) 1px;
							border-radius: 8px;
							z-index: 9999;
							font-family: sans-serif;
							font-size: 1.375em;
							width: fit-content;
							box-shadow: 0 0 20px rgba(0, 0, 0, 0.75);
							opacity: 0;
							transition: all 0.3s cubic-bezier(.05,.77,.26,.98);
							transform: translateX(25%);
							background-color: rgb(30, 30, 30);
					 }
					 .boostmyexams_toast:hover {
							background-color: rgb(43, 43, 43) !important;
					 }
				 </style>
				\`;
				document.head.insertAdjacentHTML("beforeend", style);
		 }

		 const info = {
				"SME.revision-note-views": 0,
				"SME.topic-question-part-solution-views": 0
		 };
		 const keys = Object.keys(info);

		 function toast(message, type = "info", duration = 3000) {
				let toast = document.querySelector(".boostmyexams_toast");

				const icon = {
					 info: \`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>\`,
					 success: \`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>\`,
					 error: \`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>\`,
					 alert: \`<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>\`
				}[type] || "";

				if (!toast) {
					 toast = document.createElement("div");
					 toast.className = "boostmyexams_toast";
					 document.body.appendChild(toast);
				}

				if (toast._hideTimeout) clearTimeout(toast._hideTimeout);
				if (toast._hideTimer) clearTimeout(toast._hideTimer);

				toast.className = "boostmyexams_toast";
				toast.innerHTML = \`
					 <p style="display:flex;align-items:center;gap:0.5ch;font-size:1.2em;font-weight:bold;margin:0 0 0.5em 0;">
							${icon}<span>BoostMyExams</span>
					 </p>
					 <div style="font-size:0.7em;padding: 6px 8px 3px;background-color:hsla(0,0%,100%,0.05);border-radius:3px;">${message.replace(/\n/g, "<br>")}</div>
				\`;

				requestAnimationFrame(() => {
					 toast.style.opacity = "1";
					 toast.style.transform = "translateX(0)";
				});

				const scheduleHide = () => {
					 toast._hideTimer = setTimeout(() => {
							toast.style.opacity = "0";
							toast.style.transform = "translateX(25%)";
							toast._hideTimeout = setTimeout(() => {
								 toast.remove();
								 toast._hideTimeout = null;
								 toast._hideTimer = null;
							}, 300);
					 }, duration);
				};

				toast.addEventListener("mouseenter", () => {
					 if (toast._hideTimer) clearTimeout(toast._hideTimer);
					 if (toast._hideTimeout) clearTimeout(toast._hideTimeout);
				});

				toast.addEventListener("mouseleave", () => {
					 if (!toast._hideTimer && !toast._hideTimeout) return;
					 scheduleHide();
				});

				scheduleHide();
		 }

		 const clearKeys = (showAlert = false, updateInfo = true) => {
				keys.forEach(k => {
					 localStorage?.removeItem(k);
					 if (updateInfo) info[k] = 0;
				});
				if (showAlert) toast("Keys Cleared!", "success");
		 };

		 const showInfo = () => {
				toast(\`Notes Unlocked: ${info["SME.revision-note-views"]}\\nAnswers Unlocked: ${info["SME.topic-question-part-solution-views"]}\`)
		 };

		 const originalSetItem = localStorage.setItem;
		 const debounceTimers = {};
		 const DEBOUNCE_MS = 300;
		 localStorage.setItem = function (key, value) {
				if (keys.includes(key)) {
					 if (debounceTimers[key]) return;
					 debounceTimers[key] = setTimeout(() => debounceTimers[key] = null, DEBOUNCE_MS);
					 info[key]++;
					 return;
				}
				originalSetItem.apply(this, arguments);
		 };
		 clearKeys(false, false);

		 const injectUI = () => {
				// const downloadBtn = document.querySelector("#desktop-answers-dropdown")
				// if (downloadBtn) {
				//    const container = downloadBtn.parentElement;
				//    downloadBtn.remove()
				//    container.insertAdjacentHTML("afterbegin", \`
				//    <button class="btn btn-light justify-content-center dropdown-toggle" type="button" id="desktop-answers-dropdown" aria-expanded="false">
				//       <span class="flex-grow-1">
				//           <span class="d-flex align-items-center flex-nowrap">
				//               Boost My Answers
				//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
				//                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				//                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
				//                  <polyline points="7 10 12 15 17 10"/>
				//                  <line x1="12" x2="12" y1="15" y2="3"/>
				//               </svg>
				//           </span>
				//       </span>
				//    </button>
				//   \`)
				// }

				const courseNavDesktop = document.querySelector(".CourseNavigationDesktop_sideBar__0jpAp");
				if (courseNavDesktop) {
					 courseNavDesktop.insertAdjacentHTML("beforeend", \`
							<div class="border-bottom w-100"></div>
							<button aria-label="Mock Exams" title="Refresh BoostMyExams"
								 class="btn justify-content-center btn-primary ButtonIcon_large__4yD66 ButtonIcon_rounded__TLKY_ ButtonIcon_button__8mJq7 boostmyexams boostmyexams_refreshBtn">
								 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
										<path d="M21 3v5h-5"/>
								 </svg>
							</button>
							<button aria-label="Boost Info" title="Show BoostMyExams Info"
								 class="btn justify-content-center btn-neutral ButtonIcon_large__4yD66 ButtonIcon_rounded__TLKY_ ButtonIcon_button__8mJq7 boostmyexams boostmyexams_infoBtn">
								 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
										fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<circle cx="12" cy="12" r="10"/>
										<path d="M12 16v-4"/><path d="M12 8h.01"/>
								 </svg>
							</button>
					 \`);
					 document.querySelector(".boostmyexams_refreshBtn").onclick = () => clearKeys(true);
					 document.querySelector(".boostmyexams_infoBtn").onclick = () => showInfo();
				}
		 };

		 const observer = new MutationObserver(() => injectUI());
		 observer.observe(document.body, { childList: true, subtree: true });
		 injectUI();

		 // async function downloadAnswers () {
		 //    // LIBS
		 //    await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
		 //    await loadScript("https://cdn.jsdelivr.net/npm/jszip@3.10.0/dist/jszip.min.js");
		 //
		 //    const sleep = ms => new Promise(res => setTimeout(res, ms));
		 //    const toast = (msg, type = "log") => console[type](\`[Bookmarklet] ${msg}\`);
		 //
		 //    const captureAndZipAnswers = async () => {
		 //       const zip = new JSZip();
		 //       const questionBtns = document.querySelectorAll("[data-cy='question-page-numbers'] button");
		 //
		 //       if (!questionBtns.length) {
		 //          toast("No question buttons found", "warn");
		 //          return;
		 //       }
		 //
		 //       toast("Capturing answers...", "info");
		 //
		 //       for (const [i, btn] of [...questionBtns].entries()) {
		 //          btn.click();
		 //          await sleep(800);
		 //
		 //          const answerBtn = document.querySelector("[data-cy='question-answer-button']");
		 //          if (!answerBtn) continue;
		 //
		 //          answerBtn.click();
		 //          await sleep(500);
		 //
		 //          const modal = document.querySelector(".AnswerModal_modalBody__byY1G");
		 //          if (!modal) continue;
		 //
		 //          const canvas = await html2canvas(modal, { backgroundColor: "#fff" });
		 //          const dataUrl = canvas.toDataURL("image/png");
		 //          const base64Data = dataUrl.split(',')[1];
		 //          zip.file(\`question-${i + 1}.png\`, base64Data, { base64: true });
		 //
		 //          const closeBtn = modal.parentElement?.querySelector("[aria-label='Close']");
		 //          closeBtn?.click();
		 //
		 //          await sleep(500);
		 //       }
		 //
		 //       toast("Zipping...", "info");
		 //
		 //       const content = await zip.generateAsync({ type: "blob" });
		 //       const link = document.createElement("a");
		 //       link.href = URL.createObjectURL(content);
		 //       link.download = "answers.zip";
		 //       link.click();
		 //
		 //       toast("Done!", "info");
		 //    };
		 //
		 //    await captureAndZipAnswers();
		 // }


	})();
`}
