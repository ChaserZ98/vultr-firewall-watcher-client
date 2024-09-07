import { useContext } from "react";
import { Link } from "react-router-dom";

import { mdiCog, mdiThemeLightDark } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Button,
    Navbar,
    NavbarBrand,
    NavbarItem,
    Link as NextUILink,
} from "@nextui-org/react";

import { ThemeContext } from "@/hooks/theme/theme";

export default function Navigation() {
    const [_, themeDispath] = useContext(ThemeContext);
    return (
        <Navbar shouldHideOnScroll>
            <NavbarBrand>
                <NextUILink
                    to="/"
                    color="foreground"
                    size="lg"
                    isBlock
                    as={Link}
                >
                    Vultr Firewall Watcher
                </NextUILink>
            </NavbarBrand>
            <NavbarItem>
                <Button to="/settings" isIconOnly as={Link}>
                    <Icon
                        path={mdiCog}
                        size={1.5}
                        className="hover:animate-[spin_3s_linear_infinite]"
                    />
                </Button>
            </NavbarItem>
            <NavbarItem>
                <Button
                    isIconOnly
                    onClick={() => themeDispath({ type: "TOGGLE" })}
                >
                    <Icon path={mdiThemeLightDark} size={1.5} />
                </Button>
            </NavbarItem>
        </Navbar>
    );
}
