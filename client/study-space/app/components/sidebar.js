"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoBookOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

export const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`sidebar ${isCollapsed ? "sidebarClose" : ""}`}>
      <ul>
        <li className="flex items-center justify-between">
          {!isCollapsed && <span>StudySpace.AI</span>}
          <div className="icon-wrapper" onClick={toggleSidebar}>
            <MdOutlineKeyboardDoubleArrowLeft 
              className={`transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : "rotate-0"
              }`}
              size={22}
            />
          </div>
        </li>

        <li>
            <div className="SideBySide">
            {isCollapsed ? (
            <Link href="/">
            <AiOutlineHome 
                color={pathname === "/" ? "#5e63ff" : "#e6e6ef"}
                size={22}
            />
            </Link>
            ) : (
            <AiOutlineHome 
                color={pathname === "/" ? "#5e63ff" : "#e6e6ef"}
                size={22}
            />
            )}
            {!isCollapsed && (
              <Link
                href="/"
                className={pathname === "/" ? "currentLink" : "notCurrentLink"}
              >
                Home
              </Link>
            )}                  
            </div>    
        </li>

        
        <li>
          <div className="SideBySide">
          {isCollapsed ? (
            <Link href="/history">
                <IoBookOutline 
                    color={pathname === "/history" ? "#5e63ff" : "#e6e6ef"}
                    size={22}
                />
            </Link>
          ) : (
            <IoBookOutline 
                color={pathname === "/history" ? "#5e63ff" : "#e6e6ef"}
                size={22}
            />
          )}
          {!isCollapsed && (
            <Link
              href="/history"
              className={pathname === "/history" ? "currentLink" : "notCurrentLink"}
            >
              Quizzes
            </Link>
          )}
          </div>    
        </li>

        <li>
          <div className="SideBySide">
          {isCollapsed ? (
            <Link href="/profile">
                <CgProfile 
                color={pathname === "/profile" ? "#5e63ff" : "#e6e6ef"}
                size={22}
                />
            </Link>
            ) : (
            <CgProfile 
                color={pathname === "/profile" ? "#5e63ff" : "#e6e6ef"}
                size={22}
            />
          )}
          {!isCollapsed && (
            <Link
                href="/profile"
                className={pathname === "/profile" ? "currentLink" : "notCurrentLink"}
            >
                Profile
            </Link>
          )}
          </div>    
        </li>
      </ul>
    </nav>
  );
};
