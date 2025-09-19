"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getAccessToken,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken as setAccessCookie,
  setRefreshToken,
} from "@/utils/token";
import { useRouter } from "next/navigation";
import { AuthenApi } from "@/apis/authen";
import { SwalCenter } from "@/utils/sweetAlertCenter";
import PageLoading from "@/components/pageLoading";

type UserProfile = {
  id: number;
  organizationId: number | null;
  prefix: string;
  fname: string;
  middlename: string | null;
  lname: string;
  thaiNationalID: string;
  email: string;
  role: "SUPERADMIN" | "ADMIN";
  permission: any[];
};
type AuthContextValue = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isMobile: boolean;
  userExist: boolean | undefined;
  userProfile: UserProfile | undefined;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [userExist, setUserExist] = useState<boolean>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
  const [accessToken, setAccessToken] = useState<string | undefined>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingLabel, setLoadingLabel] = useState<string>("");

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setIsMobile(true);
      else setIsMobile(false);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const validate = async () => {
    setIsLoading(true);
    setLoadingLabel("กำลังดึงข้อมูลผู้ใช้");
    try {
      if (pathname.includes("dashboard")) {
        setUserExist(true);
        return;
      }
      const userResponse: any = await AuthenApi.validate();

      if (userResponse.data) {
        setUserProfile(userResponse.data.data);
        setUserExist(true);
      } else {
        throw {
          data: {
            messageTh: "ดึงข้อมูลไม่สำเร็จ",
          },
        };
      }
    } catch (error: any) {
      if (await getAccessToken()) {
        SwalCenter(
          "error",
          "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้",
          error.data?.messageTh,
          () => router.push("/login")
        );
      }
      setUserExist(false);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setLoadingLabel("กำลังเข้าสู่ระบบ");
    try {
      const loginResponse: any = await AuthenApi.login(email, password);
      if (loginResponse.data.statusCode === 200) {
        const accessToken = loginResponse.data.accessToken;
        const refreshToken = loginResponse.data.refreshToken;
        await setAccessCookie(accessToken);
        await setRefreshToken(refreshToken);
        initSetAccessToken();
        SwalCenter(
          "success",
          "เข้าสู่ระบบสำเร็จ",
          "",
          () => router.push("/"),
          1
        );
      }
    } catch (error: any) {
      SwalCenter("error", error?.response?.data?.messageTh, "");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeAccessToken();
      await removeRefreshToken();
      setAccessToken("");
      setUserExist(false);
      setUserProfile(undefined);
      SwalCenter(
        "success",
        "ออกจากระบบสำเร็จ",
        "ระบบกำลังพาคุณไปที่หน้าเข้าสู่ระบบ",
        () => router.push("/login"),
        1
      );
    } catch (error) {
      SwalCenter("error", "ออกจากระบบไม่สำเร็จ");
    }
  };

  const initSetAccessToken = async () => {
    setAccessToken(await getAccessToken());
  };

  useEffect(() => {
    initSetAccessToken();
  }, []);

  useEffect(() => {
    isUserAuthenticated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, userExist, accessToken]);

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const isUserAuthenticated = async () => {
    if (userExist === true) {
      if (accessToken) redirectToHome();
    } else if (userExist === false) {
      redirectToLogin();
    }
  };

  const noAuthRequiredPaths = ["login", "dashboard"];

  const redirectToLogin = () => {
    if (!noAuthRequiredPaths.some((path) => pathname.includes(path)))
      router.push("/login");
  };

  const redirectToHome = () => {
    if (noAuthRequiredPaths.some((path) => pathname.includes(path)))
      router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isMobile,
        userExist,
        userProfile,
      }}
    >
      {isLoading && <PageLoading label={loadingLabel} />}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
