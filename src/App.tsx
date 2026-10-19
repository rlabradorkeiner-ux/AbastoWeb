import {
  useEffect,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

type Tab = "left" | "center" | "right";

const assets = {
  back: "/assets/79a4f.png",
  cover: "/assets/58057.png",
  dot: "/assets/7c8c8.svg",
  front: "/assets/5a5be.png",
  rotate: "/assets/5cc64.svg",
  tabs: "/assets/bd1d8.svg",
};

const tabs: Tab[] = ["left", "center", "right"];

const labels: Record<Tab, string> = {
  left: "Plegar o desplegar la pestaña izquierda",
  center: "Plegar o desplegar ambas pestañas",
  right: "Plegar o desplegar la pestaña derecha",
};

export default function App() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [focal, setFocal] = useState({ active: false, x: 50, y: 50 });

  const selectTab = (tab: Tab) => {
    if (tab === "left") {
      setLeftOpen((current) => !current);
      return;
    }

    if (tab === "right") {
      setRightOpen((current) => !current);
      return;
    }

    const shouldOpen = !(leftOpen && rightOpen);
    setLeftOpen(shouldOpen);
    setRightOpen(shouldOpen);
  };

  const updateFocalPoint = (event: ReactPointerEvent<HTMLElement>) => {
    setFocal({
      active: true,
      x: (event.clientX / window.innerWidth) * 100,
      y: (event.clientY / window.innerHeight) * 100,
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 2) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFocalPoint(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!focal.active || (event.buttons & 2) === 0) return;
    updateFocalPoint(event);
  };

  const stopFocal = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 2 && event.type !== "pointercancel") return;
    setFocal((current) => ({ ...current, active: false }));
  };

  const isControlActive = (tab: Tab) => {
    if (tab === "left") return leftOpen && !rightOpen;
    if (tab === "right") return rightOpen && !leftOpen;
    return leftOpen === rightOpen;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLeftOpen(false);
        setRightOpen(false);
      }

      if (event.key === "ArrowLeft") {
        selectTab("left");
      }

      if (event.key === "ArrowRight") {
        selectTab("right");
      }

      if (event.key === "Enter") {
        selectTab("center");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [leftOpen, rightOpen]);

  return (
    <main
      className={[
        "prototype",
        leftOpen ? "is-left-open" : "",
        rightOpen ? "is-right-open" : "",
        showBack ? "is-back" : "",
        focal.active ? "is-focal" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          "--focal-x": `${focal.x}%`,
          "--focal-y": `${focal.y}%`,
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopFocal}
      onPointerCancel={stopFocal}
      onContextMenu={(event) => event.preventDefault()}
    >
      <p className="zoom-hint">Zoom - Right Click</p>

      <section className="artwork-stage" aria-label="Mercado de Abasto Proveedor">
        <div className="artwork-position">
          <div className="artwork-flipper">
            <div className="artwork-side artwork-inside">
              <div className="artwork-base">
                <img
                  src={assets.front}
                  alt="Corte ilustrado del Mercado de Abasto Proveedor"
                  draggable={false}
                />
              </div>

              <div className="fold-panel fold-panel-left">
                <div className="panel-face panel-cover panel-cover-left">
                  <img src={assets.cover} alt="" draggable={false} />
                </div>
                <div className="panel-face panel-interior panel-interior-left">
                  <img src={assets.front} alt="" draggable={false} />
                </div>
              </div>

              <div className="fold-panel fold-panel-right">
                <div className="panel-face panel-cover panel-cover-right">
                  <img src={assets.cover} alt="" draggable={false} />
                </div>
                <div className="panel-face panel-interior panel-interior-right">
                  <img src={assets.front} alt="" draggable={false} />
                </div>
              </div>
            </div>

            <div className="artwork-side artwork-reverse">
              <div className="reverse-card">
                <img
                  src={assets.back}
                  alt="Vista histórica del Mercado de Abasto desde Lavalle"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          <div className="artwork-hit-zones">
            <button
              type="button"
              aria-label={labels.left}
              aria-pressed={leftOpen}
              onClick={() => selectTab("left")}
            />
            <button
              type="button"
              aria-label={labels.right}
              aria-pressed={rightOpen}
              onClick={() => selectTab("right")}
            />
          </div>
        </div>
      </section>

      <nav className="fold-controls" aria-label="Controles del desplegable">
        <div className="tab-selector">
          <img className="tab-outline" src={assets.tabs} alt="" />
          <div className="tab-buttons">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                aria-label={labels[tab]}
                aria-pressed={isControlActive(tab)}
                onClick={() => selectTab(tab)}
              >
                <img
                  className={isControlActive(tab) ? "active" : ""}
                  src={assets.dot}
                  alt=""
                />
              </button>
            ))}
          </div>
        </div>

        <button
          className="rotate-button"
          type="button"
          aria-label={showBack ? "Mostrar el frente" : "Mostrar el reverso"}
          aria-pressed={showBack}
          onClick={() => {
            setLeftOpen(false);
            setRightOpen(false);
            setShowBack((current) => !current);
          }}
        >
          <img src={assets.rotate} alt="" />
        </button>
      </nav>
    </main>
  );
}
