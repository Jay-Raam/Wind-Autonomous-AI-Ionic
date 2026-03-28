import { useEffect } from "react";

import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonRouter,
} from "@ionic/react";
import { App as CapacitorApp } from "@capacitor/app";
import SwiperSlider from "../components/SwiperSlider";
import { PluginListenerHandle } from "@capacitor/core";

const Home: React.FC = () => {
  const router = useIonRouter();

  // exit the app
  const [presentAlert] = useIonAlert();


  useEffect(() => {
    let listenerHandle: PluginListenerHandle | undefined;

    const setupListener = async () => {
      listenerHandle = await CapacitorApp.addListener("backButton", () => {
        if (router.routeInfo.pathname === "/home") {
          presentAlert({
            header: "Exit App",
            message: "Are you sure you want to exit the app?",
            buttons: [
              { text: "Cancel", role: "cancel" },
              {
                text: "Yes",
                handler: () => {
                  CapacitorApp.exitApp();
                },
              },
            ],
          });
        } else {
          router.goBack();
        }
      });
    };

    setupListener();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [router, presentAlert]);

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
    }, 3000);
  };

  const onLogoutClick = () => {
    presentAlert({
      header: "Logout",
      message: "Are you sure you want to logout?",
      buttons: [
        "Cancel",
        {
          text: "Logout",
          handler: () => {
            // Clear localStorage and sessionStorage
            localStorage.clear();
            sessionStorage.clear();

            // Optionally redirect user after logout
            window.location.href = "/login";
          },
        },
      ],
    });
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <div className="top-menu-logo">
            <IonTitle>SILIGREEN</IonTitle>
            <div
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={onLogoutClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onLogoutClick();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="Icon-logout"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    strokeDasharray="36"
                    strokeDashoffset="36"
                    d="M12 4h-7c-0.55 0 -1 0.45 -1 1v14c0 0.55 0.45 1 1 1h7"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      dur="0.5s"
                      values="36;0"
                    />
                  </path>
                  <path
                    strokeDasharray="14"
                    strokeDashoffset="14"
                    d="M9 12h11.5"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      begin="0.6s"
                      dur="0.2s"
                      values="14;0"
                    />
                  </path>
                  <path
                    strokeDasharray="6"
                    strokeDashoffset="6"
                    d="M20.5 12l-3.5 -3.5M20.5 12l-3.5 3.5"
                  >
                    <animate
                      fill="freeze"
                      attributeName="stroke-dashoffset"
                      begin="0.8s"
                      dur="0.2s"
                      values="6;0"
                    />
                  </path>
                </g>
              </svg>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <SwiperSlider />

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inbox</IonTitle>
          </IonToolbar>
        </IonHeader>
      </IonContent>
    </IonPage>
  );
};

export default Home;
