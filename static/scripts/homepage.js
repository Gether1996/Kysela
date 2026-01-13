function smoothScroll(targetId) {
    var target = document.getElementById(targetId);
    if (target) {
      // Dynamically calculate navbar + under-navbar-text height
      var navbar = document.querySelector('.navbar');
      var underNavbar = document.querySelector('.under-navbar-text');
      var navbarHeight = navbar ? navbar.offsetHeight : 120;
      var underNavbarHeight = underNavbar ? underNavbar.offsetHeight : 40;
      
      // Check if mobile view
      var isMobile = window.innerWidth <= 500;
      var offset = isMobile ? navbarHeight + 10 : navbarHeight + underNavbarHeight - 60;
      
      var targetPosition = target.offsetTop - offset;
      var startPosition = window.pageYOffset; // Get current position
      var distance = targetPosition - startPosition;
      var duration = 1000; // Set the duration of the scroll in milliseconds
      let start = null;

      // Function to perform the scrolling animation
      function animation(currentTime) {
        if (start === null) {
          start = currentTime;
        }
        var timeElapsed = currentTime - start;
        var run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      // Easing function for smooth scrolling
      function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }
}

function scrollToTop() {
  const startPosition = window.pageYOffset;
  const distance = -startPosition;
  const duration = 1000;
  let start = null;

  function animation(currentTime) {
    if (start === null) {
      start = currentTime;
    }
    const timeElapsed = currentTime - start;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  // Easing function for smooth scrolling
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

var modal = document.getElementById("myModal");
var img = document.getElementById("img01");
var modalImg = document.getElementById("img01");

document.getElementsByClassName("close")[0].onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function openBiggerImage(photoSrc) {
    modal.style.display = "block";
    modalImg.src = photoSrc;
}

function openSwal(id) {
    const massages = {
        1: {
            title: 'Klasická masáž',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Klasická masáž je jedna z najrozšírenejších foriem terapie na <span style="color: #4CAF50; font-weight: 600;">uvoľnenie svalového napätia</span>, 
                        podporu krvného obehu a zlepšenie celkovej pohody.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Hlavné techniky</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Hladenie</strong> – jemné pohyby na zahriatie pokožky</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Hnetenie</strong> – hlbšie pôsobenie na odstránenie napätia</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Rázne údery</strong> – rytmické poklepy na stimuláciu obehu</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Vibrovanie</strong> – jemné trasenie na relaxáciu</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Vhodné na:</strong> Bolesti chrbta, stres, svalovú stuhnutosť, celkovú regeneráciu
                    </p>
                </div>
            `        
        },
        2: {
            title: 'Športová masáž',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Intenzívna technika zameraná na <span style="color: #4CAF50; font-weight: 600;">svalovú regeneráciu</span>, 
                        prevenciu zranení a zvýšenie fyzického výkonu.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Hlavné techniky</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Hĺbková masáž</strong> – intenzívny tlak na hlbšie vrstvy</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Trenie</strong> – rázne pohyby na stimuláciu cirkulácie</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Stretching</strong> – natiahnutie svalov pre flexibilitu</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Percusné techniky</strong> – rýchle údery pred výkonom</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Vhodné pre:</strong> Športovcov, aktívnych jedincov, prevenciu zranení, regeneráciu
                    </p>
                </div>
            `        
        },
        3: {
            title: 'Relaxačná masáž',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Jemná technika na <span style="color: #4CAF50; font-weight: 600;">odstránenie stresu</span>, 
                        uvoľnenie napätia a navodenie hlbokej pohody.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Hlavné techniky</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Jemné hladenie</strong> – upokojujúce pohyby</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Pomalé hnetenie</strong> – bez hlbokého tlaku</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Aromaterapia</strong> – s esenciálnymi olejmi</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Teplé obklady</strong> – zvýšený efekt uvoľnenia</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Ideálne pri:</strong> Strese, nespavosti, únave, psychickom napätí
                    </p>
                </div>
            `
        },
        4: {
            title: 'Mäkké techniky',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Šetrné terapeutické metódy na <span style="color: #4CAF50; font-weight: 600;">uvoľnenie napätia</span> 
                        a obnovenie rovnováhy pomocou jemného prístupu.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Hlavné techniky</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Myofasciálna technika</strong> – uvoľnenie fascií</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Mobilizácie</strong> – uvoľnenie kĺbov</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Trigger point</strong> – odstránenie bolestivých bodov</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">PIR technika</strong> – obnovenie pružnosti svalov</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Vhodné na:</strong> Svalové bolesti, kĺbové problémy, chronické zápaly, relaxáciu
                    </p>
                </div>
            `
        },
        5: {
            title: 'Lávové kamene',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Relaxačná technika využívajúca <span style="color: #4CAF50; font-weight: 600;">teplo vulkanických kameňov</span> 
                        na hlbokú relaxáciu a podporu krvného obehu.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Spôsoby aplikácie</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Statická aplikácia</strong> – kamene na energetických bodoch</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Masáž kameňmi</strong> – jemné masírovanie pokožky</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Kombinovaná terapia</strong> – s aromaterapiou</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Účinky:</strong> Zmiernenie stresu, detoxikácia, energetická rovnováha
                    </p>
                </div>
            `        
        },
        6: {
            title: 'Bankovanie',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Tradičná metóda využívajúca <span style="color: #4CAF50; font-weight: 600;">vákuové poháre</span> 
                        na stimuláciu obehu, zmiernenie bolesti a detoxikáciu.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Spôsoby aplikácie</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Suché bankovanie</strong> – priama aplikácia pohárov</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Mokré bankovanie</strong> – s jemným narezaním</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Pohyblivé bankovanie</strong> – posúvanie pohárov</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Účinky:</strong> Svalové bolesti, zápaly, migrény, posilnenie imunity
                    </p>
                </div>
            `
        
        },
        7: {
            title: 'Moxovanie',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Starodávna čínska metóda využívajúca <span style="color: #4CAF50; font-weight: 600;">teplo z horiacej moxy</span> 
                        na stimuláciu akupunktúrnych bodov a posilnenie energie.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Spôsoby aplikácie</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Priama moxa</strong> – kužele priamo na pokožke</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Nepriama moxa</strong> – cez medzičlánok (cesnak, soľ)</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Moxovacie cigary</strong> – držané nad pokožkou</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Vhodné pri:</strong> Chronických ochoreniach, kĺbových bolestiach, oslabení imunity
                    </p>
                </div>
            `        
        },
        8: {
            title: 'FUSS Terapia',
            html: `
                <div style="max-width: 650px; margin: 0 auto; text-align: left;">
                    <p style="font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 20px;">
                        Špeciálna metóda <span style="color: #4CAF50; font-weight: 600;">reflexnej masáže chodidiel</span>, 
                        ktorá stimuluje body prepojené s orgánmi a systémami tela.
                    </p>
                    
                    <div style="background: linear-gradient(145deg, #f8f9fa, #ffffff); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="margin: 0 0 15px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">Hlavné benefity</h4>
                        <div style="display: grid; gap: 10px;">
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Zmiernenie stresu</strong> – úľava od napätia a únavy</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Podpora obehu</strong> – zlepšenie krvného obehu</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Posilnenie imunity</strong> – aktivácia obranných síl</div>
                            </div>
                            <div style="display: flex; align-items: start; gap: 10px;">
                                <span style="color: #4CAF50; font-size: 18px; font-weight: bold;">✓</span>
                                <div><strong style="color: #2c3e50;">Energetická rovnováha</strong> – harmónia tela i mysle</div>
                            </div>
                        </div>
                    </div>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 15px; padding: 12px; background: #f0f8f0; border-radius: 8px;">
                        <strong style="color: #2E7D32;">Odporúčané pre:</strong> Prevenciu, celkovú regeneráciu, harmonizáciu organizmu
                    </p>
                </div>
            `
        }
    };

    if (massages[id]) {
        Swal.fire({
            title: massages[id].title,
            width: '800px',
            html: massages[id].html,
            confirmButtonText: 'Zavrieť',
            confirmButtonColor: '#4CAF50',
            background: "#ffffff",
            customClass: {
                title: 'swal-title-custom',
                popup: 'swal-popup-custom'
            },
            didOpen: () => {
                const style = document.createElement('style');
                style.textContent = `
                    .swal-title-custom {
                        color: #2E7D32 !important;
                        font-size: 26px !important;
                        font-weight: 600 !important;
                        padding: 20px 20px 10px 20px !important;
                    }
                    .swal-popup-custom {
                        border-radius: 16px !important;
                        padding: 0 !important;
                    }
                    .swal2-html-container {
                        padding: 0 20px 20px 20px !important;
                        margin: 0 !important;
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
}