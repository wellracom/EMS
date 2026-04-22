"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "@/hooks/useAuth";

import {
  FaHome,
  FaCalendar,
  FaUser,
  FaTable,
  FaChartBar,
  FaShieldAlt,
  FaChevronDown,
  FaEllipsisH,
} from "react-icons/fa";
import {BsCpuFill} from 'react-icons/bs'

// ================= TYPES =================
type Role = "admin" | "operator" | "supervisor" | "maintanace";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: Role[];
  subItems?: {
    name: string;
    path: string;
    roles?: Role[];
  }[];
};

// ================= NAV CONFIG =================
const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    subItems: [
      { name: "Overview", path: "/", roles: ["admin", "operator"] },
    ],
  },
  {
    name: "Calendar",
    icon: <FaCalendar />,
    path: "/calendar",
    roles: ["admin"],
  },
  {
    name: "User Management",
    icon: <FaUser />,
    path: "/account-settings",
    roles: ["admin"],
  },
  {
    name: "Tables",
    icon: <FaTable />,
    subItems: [
      {
        name: "Basic Tables",
        path: "/basic-tables",
        roles: ["admin", "operator"],
      },
    ],
  },
  
];

const othersItems: NavItem[] = [
  {
    name: "Charts",
    icon: <FaChartBar />,
    subItems: [
      {
        name: "Line Chart",
        path: "/line-chart",
        roles: ["admin", "supervisor"],
      },
    ],
  },
  {
    name: "Admin Only",
    icon: <FaShieldAlt />,
    path: "/admin",
    roles: ["admin"],
  },
    {
    name: "Modbus TCP",
    icon: <BsCpuFill />,
    path:'/controller/modbus-tcp'
  },
   {
    name: "User Management",
    icon: <FaUser />,
    path: "/accountsettings",
    roles: ["admin"],
  },
];

// ================= ROLE FILTER =================
const filterByRole = (items: NavItem[], role?: Role): NavItem[] => {
  if (!role) return [];

  return items
    .map((item) => ({
      ...item,
      subItems: item.subItems?.filter(
        (sub) => !sub.roles || sub.roles.includes(role)
      ),
    }))
    .filter((item) => {
      if (item.roles && !item.roles.includes(role)) return false;
      if (item.subItems) return item.subItems.length > 0;
      return true;
    });
};

// ================= COMPONENT =================
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuth();

  // 🔥 FIX LOOP: memoize
  const filteredNavItems = useMemo(
    () => filterByRole(navItems, user?.role),
    [user?.role]
  );

  const filteredOthersItems = useMemo(
    () => filterByRole(othersItems, user?.role),
    [user?.role]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  // ================= AUTO OPEN =================
useEffect(() => {
  let found = false;

  const menus = [
    { type: "main", items: filteredNavItems },
    { type: "others", items: filteredOthersItems },
  ];

  for (const menu of menus) {
    for (let index = 0; index < menu.items.length; index++) {
      const nav = menu.items[index];

      if (nav.subItems) {
        for (const sub of nav.subItems) {
          if (sub.path === pathname) {
            setOpenSubmenu((prev) => {
              if (
                prev?.type === menu.type &&
                prev?.index === index
              ) {
                return prev;
              }
              return { type: menu.type as any, index };
            });
            found = true;
          }
        }
      }
    }
  }

  if (!found) {
    setOpenSubmenu((prev) => (prev ? null : prev));
  }
}, [pathname]); // ✅ FIX: hanya 1 dependency

  // ================= HEIGHT =================
  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];

      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: el.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const toggleSubmenu = (index: number, type: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.index === index && prev.type === type
        ? null
        : { index, type }
    );
  };

  // ================= RENDER =================
  const renderMenu = (items: NavItem[], type: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => toggleSubmenu(index, type)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white w-full"
              >
                {nav.icon}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="flex-1 text-left">{nav.name}</span>
                    <FaChevronDown
                      className={`transition ${
                        openSubmenu?.index === index &&
                        openSubmenu.type === type
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>

              <div
                ref={(el) => {
                  subMenuRefs.current[`${type}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.index === index &&
                    openSubmenu.type === type
                      ? subMenuHeight[`${type}-${index}`]
                      : 0,
                }}
              >
                <ul className="ml-8 mt-2 space-y-1">
                  {nav.subItems.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.path}
                        className={`block p-2 rounded ${
                          isActive(sub.path)
                            ? "bg-blue-500 text-white"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`flex items-center gap-3 p-2 rounded-lg ${
                  isActive(nav.path)
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"
                } `}
              >
                {nav.icon}
                {(isExpanded || isHovered || isMobileOpen) && nav.name}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 lg:mt-0 top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 transition-all z-50
        ${isExpanded || isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ LOGO ORIGINAL */}
    <div
  className={`py-8 flex ${
    !isExpanded && !isHovered
      ? "lg:justify-center px-2"
      : "justify-start px-4"
  }`}
>
  <Link href="/" className="flex items-center justify-center w-full">
    {isExpanded || isHovered || isMobileOpen ? (
      <>
        <Image
          className="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width={150}
          height={40}
        />
        <Image
          className="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width={150}
          height={40}
        />
      </>
    ) : (
      <div className="flex items-center justify-center w-full">
        <Image
          src="/images/logo/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mx-auto"
        />
      </div>
    )}
  </Link>
</div>

      {/* MENU */}
      <div className="px-3 space-y-6 overflow-y-auto">

        <div>
          <div className="text-xs text-gray-400 mb-2 flex justify-center lg:justify-start">
            {isExpanded || isHovered ? "Menu" : <FaEllipsisH />}
          </div>
          {renderMenu(filteredNavItems, "main")}
        </div>

        <div>
          <div className="text-xs text-gray-400 mb-2 flex justify-center lg:justify-start">
            {isExpanded || isHovered ? "Admin" : <FaEllipsisH />}
          </div>
          {renderMenu(filteredOthersItems, "others")}
        </div>

      </div>
    </aside>
  );
};

export default AppSidebar;