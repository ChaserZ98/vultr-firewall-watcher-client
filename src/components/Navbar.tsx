import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { mdiCog, mdiThemeLightDark } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuToggle,
    Link as NextUILink,
    Tooltip,
} from "@nextui-org/react";

import { Environment, useEnvironmentStore } from "@/zustand/environment";
import { Screen, useScreenStore } from "@/zustand/screen";
import { useThemeStore } from "@/zustand/theme";

export default function Navigation() {
    const location = useLocation();

    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const environment = useEnvironmentStore((state) => state.environment);
    const screenSize = useScreenStore((state) => state.size);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <Navbar
            shouldHideOnScroll
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            classNames={{
                base: "select-none transition-colors-opacity",
            }}
        >
            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="md:hidden text-foreground transition-colors-opacity"
            />
            <NavbarBrand className="text-foreground">
                <NextUILink
                    to="/"
                    color="foreground"
                    size={screenSize === Screen.SM ? "sm" : "lg"}
                    isBlock
                    as={Link}
                    className="text-medium text-wrap sm:text-large transition-colors-opacity"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Vultr Firewall Watcher
                </NextUILink>
            </NavbarBrand>
            <NavbarContent justify="center" className="hidden md:flex gap-4">
                <NavbarItem isActive={location.pathname === "/"}>
                    <NextUILink
                        to="/"
                        color="foreground"
                        size="lg"
                        isBlock
                        as={Link}
                        className="transition-colors-opacity"
                    >
                        Groups
                    </NextUILink>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/my-ip"}>
                    <NextUILink
                        to="/my-ip"
                        color="foreground"
                        size="lg"
                        isBlock
                        as={Link}
                        className="transition-colors-opacity"
                    >
                        My IP
                    </NextUILink>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent
                justify="end"
                className="data-[justify=end]:flex-grow-0 sm:data-[justify=end]:flex-grow"
            >
                <NavbarItem>
                    <Tooltip
                        content="Theme"
                        delay={500}
                        closeDelay={150}
                        classNames={{
                            content: "transition-colors-opacity",
                        }}
                    >
                        <Button
                            isIconOnly
                            onClick={() => toggleTheme()}
                            className="p-0.5 min-w-8 w-8 h-8 sm:p-1 sm:min-w-10 sm:w-10 sm:h-10 text-default-foreground"
                        >
                            <Icon path={mdiThemeLightDark} className="w-full" />
                        </Button>
                    </Tooltip>
                </NavbarItem>
                <NavbarItem
                    isActive={location.pathname === "/settings"}
                    className="group/settings"
                >
                    <Tooltip
                        content="Settings"
                        delay={500}
                        closeDelay={150}
                        classNames={{
                            content: "transition-colors-opacity",
                        }}
                    >
                        <Button
                            to="/settings"
                            isIconOnly
                            as={Link}
                            className="p-0.5 min-w-[32px] w-[32px] h-[32px] sm:p-1 sm:min-w-10 sm:w-10 sm:h-10 text-default-foreground"
                        >
                            <Icon
                                path={mdiCog}
                                className="w-full animate-[spin_3s_linear_infinite] hover:[animation-play-state:running] [animation-play-state:paused] group-data-[active=true]/settings:[animation-play-state:running]"
                            />
                        </Button>
                    </Tooltip>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu
                id="navbar-menu"
                className="transition-colors-opacity"
                style={
                    {
                        "--navbar-height":
                            environment === Environment.WINDOWS
                                ? "6rem"
                                : "4rem",
                    } as React.CSSProperties
                }
            >
                <NavbarItem isActive={location.pathname === "/"}>
                    <NextUILink
                        to="/"
                        color="foreground"
                        size="lg"
                        isBlock
                        as={Link}
                        className="transition-colors-opacity text-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Groups
                    </NextUILink>
                </NavbarItem>
                <NavbarItem isActive={location.pathname === "/my-ip"}>
                    <NextUILink
                        to="/my-ip"
                        color="foreground"
                        size="lg"
                        isBlock
                        as={Link}
                        className="transition-colors-opacity text-medium"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        My IP
                    </NextUILink>
                </NavbarItem>
            </NavbarMenu>
        </Navbar>
    );
}
