import { getToken } from "firebase/messaging";
import { useEffect, useState } from "react";
import { messaging, vapidKey } from "../../../lib/firebase";
import type { PfnsInfo } from "../../../types/firebase";
import { PfnsPost } from "../api/apiClient";
import { pfnsInfoStorage } from "../useStorage";

function getFcmReceiverId(): Promise<string | null> {
    console.log("🔍 Starter token-henting…");

    return getToken(messaging, { vapidKey })
        .then((currentToken) => {
            if (currentToken) {
                console.log("✅ FCM-token hentet:", currentToken);
                return currentToken;
            } else {
                console.warn("⚠️ Ingen FCM-token tilgjengelig. Tillat varsler i nettleseren.");
                return null;
            }
        })
        .catch((error) => {
            console.error("❌ Klarte ikke hente FCM-token:", error);
            return null;
        })
        .finally(() => {
            console.log("🔚 Token-henting fullført.");
        });
}


export function usePfns() {
    const [pfnsInfo, setPfnsInfo] = useState<PfnsInfo | null>(() => pfnsInfoStorage.get());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const syncPfns = async () => {
            console.log("🔁 syncing pfns")

            // 🔒 Hent token og registrer mot backend
            const token = await getFcmReceiverId();
            if (!token) {
                setError(new Error("Ingen FCM-token tilgjengelig"));
                setLoading(false);
                return;
            }

            // 💡 Hvis pfnsId allerede finnes, avslutt tidlig
            if (pfnsInfo?.pfnsId && pfnsInfo?.fmcId == token) {
                console.log("🔄 Bruker eksisterende pfnsId:", pfnsInfo.pfnsId);
                setLoading(false);
                return;
            }


            console.log("🔗 Registrerer FCM-token med PFNS:", token);

            try {
                const pfnsResponse = await PfnsPost<string | null>(
                    ["fcm", "register", "receiver"],
                    token
                );

                if (!pfnsResponse.data) {
                    throw new Error("Kunne ikke opprette pfnsId");
                }
                const _pfnsInfo: PfnsInfo = {
                    pfnsId: pfnsResponse.data,
                    fmcId: token
                }
                pfnsInfoStorage.set(_pfnsInfo);
                setPfnsInfo(_pfnsInfo);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        syncPfns();
    }, []);

    return { pfnsInfo, loading, error };
}
