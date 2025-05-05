import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Home, PlusCircle, Star, Heart, Bookmark, Menu, Users, UserRoundCheck, Newspaper, X } from 'lucide-react';
import MiniHeader from '../components/MiniHeader';
import { useTheme } from '../hooks/useTheme';

const Blogs = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedItem = useCallback(() => {
    const path = location.pathname;
    if (path.includes('/blogs/famous')) return 'famous';
    if (path.includes('/blogs/updates')) return 'updates';
    if (path.includes('/blogs/liked')) return 'liked';
    if (path.includes('/blogs/saved')) return 'saved';
    if (path.includes('/blogs/create')) return 'create';
    if (path.includes('/blogs/followers')) return 'followers';
    if (path.includes('/blogs/following')) return 'following';
    return 'blogs';
  },[location.pathname])

  const [selectedItem, setSelectedItem] = useState(getSelectedItem());

  useEffect(() => {
    
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    checkMobile();

    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
  useEffect(() => {
    setSelectedItem(getSelectedItem());
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [getSelectedItem, isMobile, location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && 
          isSidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  const handleClick = (id) => {
    setSelectedItem(id);
    navigate(id === 'blogs' ? '/blogs' : `/blogs/${id}`);
    
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  
  const navItems = [
    { id: 'blogs', outlineIcon: Home, label: 'Home' },
    { id: 'create', outlineIcon: PlusCircle, label: 'Create blog' },
    { id: 'updates', outlineIcon: Newspaper, label: 'Updates' },
    { id: 'famous', outlineIcon: Star, label: 'Famous' },
    { id: 'liked', outlineIcon: Heart, label: 'Liked' },
    { id: 'saved', outlineIcon: Bookmark, label: 'Saved' },
    { id: 'followers', outlineIcon: Users, label: 'Followers' },
    { id: 'following', outlineIcon: UserRoundCheck , label: 'Following' },
  ];

  return (
    <div className={`flex min-h-screen relative ${darkMode ? 'bg-[#1d2d50]' : 'bg-[#e6f1f9]'}`}>
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside
        ref={sidebarRef}
        className={`fixed h-screen flex flex-col z-30 transition-all duration-300 ease-in-out
          ${darkMode ? 'bg-gradient-to-b from-[#0a111e] to-[#1d2d50] shadow-lg' : 'bg-gradient-to-b from-blue-100 to-blue-50 shadow-lg'}
          ${isMobile ? 
            `w-64 ${isSidebarOpen ? 'left-0' : '-left-64'}` : 
            `${isSidebarOpen ? 'w-64' : 'w-20'} left-0`
          }`}
      >
        <div className="flex items-center justify-between px-4 py-6 overflow-hidden">
          <div className="flex items-center gap-3 overflow-hidden">
            {!isMobile && (
              <Menu
                size={36}
                className={`overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-110 rounded-full p-2
                  ${darkMode ? 'text-blue-400 hover:bg-[#0f192c]' : 'text-blue-700 hover:bg-blue-200'}`}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              />
            )}
            
            {(isSidebarOpen || isMobile) && (
              <button 
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-2xl"
                onClick={() => navigate('/')}>
                PostHub
              </button>
            )}
          </div>
          
          {isMobile && (
            <X
              size={28}
              className={`cursor-pointer ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-700 hover:text-blue-900'}`}
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
          {navItems.map((item) => {
            const isSelected = selectedItem === item.id;
            const Icon = item.outlineIcon;

            return (
              <button
                key={item.id}
                className={`w-full group flex items-center gap-3 px-4 py-3 rounded-md
                  ${!isSidebarOpen && !isMobile ? 'justify-center' : ''}
                  transition-all duration-300 ease-in-out
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : darkMode ? 'hover:bg-[#0f192c]' : 'hover:bg-blue-200'}`}
                onClick={() => handleClick(item.id)}
              >
                <Icon
                  size={24}
                  className={`transition-transform duration-300
                    ${isSelected 
                      ? 'text-white scale-110' 
                      : darkMode 
                        ? 'text-gray-200 group-hover:text-blue-400' 
                        : 'text-blue-600 group-hover:text-blue-700'}`}
                />
                {(isSidebarOpen || isMobile) && (
                  <span className={`text-sm font-medium
                    ${isSelected 
                      ? 'text-white' 
                      : darkMode 
                        ? 'text-gray-300 group-hover:text-blue-400' 
                        : 'text-gray-700 group-hover:text-blue-700'}`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {isMobile && (
        <header className={`fixed top-0 left-0 right-0 h-16 shadow-md flex items-center justify-between px-4 z-10
          ${darkMode ? 'bg-[#0a111e]' : 'bg-white'}`}>
          <div className="flex items-center gap-3">
            <Menu
              size={28}
              className={darkMode ? 'text-blue-400 cursor-pointer' : 'text-blue-700 cursor-pointer'}
              onClick={() => setIsSidebarOpen(true)}
            />
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-xl">
              PostHub
            </h1>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 relative
        ${isMobile ? 
          'ml-0 pt-16' : 
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
      { selectedItem !== 'create' && selectedItem !== 'followers' && selectedItem !== 'following' ?
        (
          <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-[#0a111e] text-white' : 'bg-white'}`}>
            <MiniHeader setMode={toggleDarkMode}/>

            <Outlet />
          </div>
        ) : (
          <Outlet />
        )
      }
      </main>
    </div>
  );
};

export default Blogs;