import { useSignal } from "@preact/signals";

export interface MenuItem {
  title: string;
  color?: string;
  onClick?: () => boolean | Promise<boolean>;
}

export function PopupMenu(props: { items?: MenuItem[] }) {
  const isShown = useSignal(false);

  return (
    <div class="fl-col" style={{ position: "relative" }}>
      <button
        type="button"
        onClick={(e) => {
          console.log(isShown.peek());
          isShown.value = !isShown.peek();
          console.log(isShown.peek());
        }}
        style={{
          fontSize: "1em",
          background: "none",
          border: "none",
          width: "20px",
          height: "20px",
        }}
      >
        ⁝
      </button>

      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "20px",
          transform: "translate(-100%, 20px)",
        }}
      >
        <ul
          class="fl-col"
          style={{
            backgroundColor: "#FFF",
            borderRadius: "4px",
            overflow: "hidden",
            minWidth: "70px",
            filter: "drop-shadow(0px 4px 5px #00000035)",
            visibility: isShown.value ? "visible" : "collapse",
          }}
        >
          {props.items?.map((item, i) => {
            return (
              <li key={i}>
                <div
                  class="popup-menu-item"
                  style={{ color: item.color ?? "inherit" }}
                  onClick={async () => {
                    if (item.onClick) {
                      const res = await item.onClick();
                      if (res) isShown.value = false;
                    }
                  }}
                >
                  <a
                    style={{
                      fontSize: "0.8em",
                    }}
                  >
                    {item.title}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
