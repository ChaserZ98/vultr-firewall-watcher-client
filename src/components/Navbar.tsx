import { mdiCog } from "@mdi/js";
import Icon from "@mdi/react";
import { Link, Navbar, NavbarBrand, NavbarItem } from "@nextui-org/react";

export default function Navigation() {
    return (
        <Navbar shouldHideOnScroll>
            <NavbarBrand>
                <a
                    className="font-bold text-inherit transition-colors duration-300 ease hover:text-primary"
                    href="/"
                >
                    Vultr Firewall Watcher
                </a>
            </NavbarBrand>
            <NavbarItem>
                <Link href="/settings" color="foreground">
                    <Icon
                        path={mdiCog}
                        size={1.5}
                        className="hover:animate-[spin_3s_linear_infinite]"
                    />
                </Link>
            </NavbarItem>
        </Navbar>
    );
}
