"use client";
import { useAuth } from "@/contexts/authContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { FiMenu, FiArrowRight } from "react-icons/fi";

const Navbar = () => {
    return (
        <div className="bg-gray-50">
            <FlipNav />
        </div>
    );
};

const FlipNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <nav className="bg-white p-4 border-b-[1px] border-gray-200 flex items-center justify-between relative">
            <NavLeft setIsOpen={setIsOpen} pathname={pathname} />
            <NavRight pathname={pathname} />
            <NavMenu isOpen={isOpen} pathname={pathname} />
        </nav>
    );
};

const Logo = () => {
    const router = useRouter()
    return (
        <Image src="/logo.png" alt="Logo" width={30} height={30} onClick={() => router.push('/')} className="cursor-pointer" />
    );
};


const NavLeft = ({
    setIsOpen,
    pathname,
}: {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    pathname: string;
}) => {
    return (
        <div className="flex items-center gap-6">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block lg:hidden text-gray-950 text-2xl"
                onClick={() => setIsOpen((pv) => !pv)}
            >
                <FiMenu />
            </motion.button>
            <Logo />

            {pathname !== "/login" && <><NavLink text="Tickets" /> <NavLink text="Queue" /></>}
        </div>
    );
};

const NavLink = ({ text }: { text: string }) => {
    const router = useRouter()
    return (
        <div
            onClick={() => router.push(`/${text.toLowerCase()}`)}
            rel="nofollow"
            className="hidden lg:block h-[30px] overflow-hidden font-medium cursor-pointer"
        >
            <motion.div whileHover={{ y: -30 }}>
                <span className="flex items-center h-[30px] text-gray-500">{text}</span>
                <span className="flex items-center h-[30px] text-pink-600">
                    {text}
                </span>
            </motion.div>
        </div>
    );
};

const NavRight = ({ pathname }: { pathname: string }) => {
    const { userProfile, logout } = useAuth();

    return (
        pathname !== "/login" && (
            <div className="flex items-center gap-4">
                <p>
                    {userProfile?.fname} {userProfile?.lname}
                </p>
                <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium rounded-md whitespace-nowrap"
                >
                    Logout
                </motion.button>
            </div>
        )
    );
};

const NavMenu = ({ isOpen, pathname }: { isOpen: boolean; pathname: string }) => {
    return (
        <motion.div
            variants={menuVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            className="absolute p-4 bg-white shadow-lg left-0 right-0 top-full origin-top flex flex-col gap-4"
        >
            {pathname !== "/login" && (<><MenuLink text="Tickets" /> <MenuLink text="Queue" /></>)}
        </motion.div>
    );
};
const MenuLink = ({ text }: { text: string }) => {
    const router = useRouter()
    return (
        <motion.a
            onClick={(e) => {
                e.preventDefault();
                router.push(`/${text.toLowerCase()}`);
            }}
            variants={menuLinkVariants}
            rel="nofollow"
            href="#"
            className="h-[30px] overflow-hidden font-medium text-lg flex items-start gap-2"
        >
            <motion.span variants={menuLinkArrowVariants}>
                <FiArrowRight className="h-[30px] text-gray-950" />
            </motion.span>
            <motion.div whileHover={{ y: -30 }}>
                <span className="flex items-center h-[30px] text-gray-500">{text}</span>
                <span className="flex items-center h-[30px] text-pink-600">
                    {text}
                </span>
            </motion.div>
        </motion.a>
    );
};

export default Navbar;

const menuVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
        },
    },
};

const menuLinkVariants = {
    open: {
        y: 0,
        opacity: 1,
    },
    closed: {
        y: -10,
        opacity: 0,
    },
};

const menuLinkArrowVariants = {
    open: {
        x: 0,
    },
    closed: {
        x: -4,
    },
};