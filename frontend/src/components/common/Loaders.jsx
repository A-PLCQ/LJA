import React, { useEffect } from 'react';
import { gsap } from 'gsap';

const Loaders = () => {
    useEffect(() => {
        // Réinitialisation des éléments
        gsap.set(["#paper"], { scaleY: 0 });
        gsap.set("#paper-top", { scaleY: 1 });
    
        // Création du timeline pour l'animation du cadre de l'imprimante
        const tl = gsap.timeline({ ease: "none", repeat: -1 });
        tl.to("#printer-frame", {
          transformOrigin: "50% 100%",
          scaleX: 0.99,
          scaleY: 1.02,
          duration: 0.5,
          y: -2
        });
    
        // Timeline pour l'animation des boutons et du papier
        const paperTimeline = gsap.timeline({ ease: "none", repeat: -1 });
        paperTimeline
          .to("#button-2", { css: { fill: "green" } })
          .add("print", 1.2)
          .to(
            "#paper-top",
            { duration: 6, scaleY: 0, transformOrigin: "50% 100%" },
            "print"
          )
          .fromTo(
            "#paper",
            { transformOrigin: "0 0", scaleY: 0 },
            { scaleY: 1, duration: 6, delay: 5 },
            "print"
          )
          .add("complete", 9)
          .to("#paper", { y: "+=70", skewX: 30, ease: "Power4.easeOut" }, "complete");
    
        // Nettoyage pour éviter les fuites de mémoire lors du démontage du composant
        return () => {
          tl.kill();
          paperTimeline.kill();
        };
      }, []);

    return (
        <div className="printer-container">
            <svg width="550" height="415" viewBox="0 0 550 415" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="printer-frame">
                    <rect width="550" height="415" />
                    <g id="printer">
                        <g id="side-panel">
                            <path id="Rectangle 24" d="M86 226.488C86 222.07 89.5817 218.488 94 218.488H154.727V237.093H86V226.488Z" fill="#50517B" />
                            <path id="Rectangle 23" d="M86 235.791C86 231.372 89.5817 227.791 94 227.791H154.727V402.209H94C89.5817 402.209 86 398.628 86 394.209V235.791Z" fill="#383856" />
                            <rect id="Rectangle 34" x="86" y="289.419" width="24.0545" height="33.7209" fill="#27283C" />
                        </g>
                        <g id="body">
                            <path id="Rectangle 1" d="M143.273 227.791H464V394.209C464 398.628 460.418 402.209 456 402.209H151.273C146.854 402.209 143.273 398.628 143.273 394.209V227.791Z" fill="#4F517B" />
                            <path id="Rectangle 2" d="M143.273 226.488C143.273 222.07 146.854 218.488 151.273 218.488H456C460.418 218.488 464 222.07 464 226.488V227.791H143.273V226.488Z" fill="#AFAADE" />
                            <path id="Rectangle 22" d="M110.055 402.209H442.236V407C442.236 411.418 438.655 415 434.236 415H118.055C113.636 415 110.055 411.418 110.055 407V402.209Z" fill="#27283C" />
                        </g>
                        <g id="paper">
                            <rect id="paper-bottom" x="226" y="315" width="98" height="84" fill="#E5E5E5" />
                            <rect id="square" x="234" y="323" width="23" height="6" fill="#68BAFA" />
                            <rect id="signature" width="21.6634" height="2.36312" transform="matrix(1 0 0.142187 0.98984 234 372)" fill="#27283C" />
                            <rect id="text-1" x="234" y="351" width="81.3273" height="5.98007" fill="#C4C4C4" />
                            <rect id="text-2" x="234" y="335" width="81.3273" height="5.98007" fill="#C4C4C4" />
                        </g>
                        <rect id="paper-top" x="226" y="165" width="98" height="53" fill="#E5E5E5" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default Loaders;
