import {useState} from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import {Link} from '@inertiajs/react';
import {Button} from "primereact/button";

function Authenticated({user, header, children, buttons = false, info = false}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const homepageLink = user.role === "worker" ? route("packages.index") : route("dashboard");
    const routes = [
        {
            name: 'Anasayfa',
            href: route('dashboard'),
            active: route().current('dashboard'),
            roles: ["engineer","admin","salesman"]
        },
        {
            name: 'Paket Sorgulama',
            href: route('sorgulama'),
            active: route().current('sorgulama|packages.arama|packages.show'),
            roles: ["engineer","admin","salesman"]
        },
        {
            name: 'Yeni Paketler',
            href: route('packages.index'),
            active: route().current('packages.index|packages.create|packages.edit'),
            roles: ["*"]
        },
        {
            name: 'Gönderi Kodu',
            href: route('packages.trackingCodeSet'),
            active: route().current('packages.trackingCodeSet'),
            roles:["engineer","admin","salesman"]
        },
        {
            name: 'Müşteriler',
            href: route('customers.index'),
            active: route().current('customers.*'),
            roles: ["engineer","admin","salesman"]
        },
        {
            name: 'Gruplar',
            href: route('groups.index'),
            active: route().current('groups.*'),
            roles: ["engineer","admin","salesman"]
        },
        {
            name: 'Ürünler',
            href: route('products.index'),
            active: route().current('products.index'),
            roles: ["engineer","admin","salesman"]
        },
        {
            name: 'Katalog',
            href: route('products.katalog'),
            active: route().current('products.katalog'),
            roles: ["*"]
        },
        {
            name: 'Kullanıcılar',
            href: route('users.index'),
            active: route().current('users.*'),
            roles: ["admin","engineer"]
        }
    ]
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={homepageLink}>
                                    <ApplicationLogo
                                        className="block h-8 w-auto fill-current text-gray-800 dark:text-gray-200"/>
                                </Link>
                            </div>

                            <div className="hidden space-x-4 sm:-my-px sm:ms-10 sm:flex">
                                {routes.map(({name, href, active,roles}, index) => {
                                    if(roles.includes(user.role) || roles.includes("*")) {
                                        return (
                                            <NavLink key={index} href={href} active={active}>
                                                {name}
                                            </NavLink>)
                                    }else{
                                        return null;
                                    }
                                })}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <span className={"bg-gray-200 h-8 w-8 rounded-full flex items-center justify-center"}><i className="pi pi-user"></i></span>

                                                <svg
                                                    className=" -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Çıkış Yap
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        {routes.map(({name, href, active,roles}, index) => {
                            if(roles.includes(user.role) || roles.includes("*")) {
                                return (
                                    <ResponsiveNavLink key={index} href={href} active={active}>
                                        {name}
                                    </ResponsiveNavLink>)
                            }else {
                                return null;
                            }
                        })}

                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profil</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Çıkış Yap
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow px-3 py-2">

                    <div className="surface-0 max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-xl text-900 py-3 sm:py-0 lg:text-3xl">{header}</div>
                                <div className="hidden items-center text-700 flex-wrap mt-2 lg:flex">
                                    {info && info.map((item, index) => {
                                        if (!item.hidden) {
                                            return <div key={index}
                                                        className={"flex items-center mt-3 " + info.length !== index + 1 && "mr-5"}>
                                                <i className={"pi mr-2 " + item.icon}></i>
                                                <span>{item.text}</span>
                                            </div>
                                        } else {
                                            return null
                                        }
                                    })}
                                </div>
                            </div>
                            {buttons &&
                                <div className="grid grid-cols-3 grid-rows-1 gap-1 ">
                                    {buttons.length === 1 && <>
                                        <span></span>
                                        <span></span>
                                    </>}{buttons.length === 2 && <>
                                    <span></span>
                                </>}

                                    {buttons.map((button, index) => <Button key={index} {...button}  />)}
                                </div>}
                        </div>
                    </div>
                </header>
            )}

            <main>{children}</main>
            <footer className={"fixed bottom-0 h-6 py-4 left-0 right-0 flex px-4 items-center justify-center bg-gray-800"}>
                <span>Her Hakkı Saklıdır &copy; {new Date().getFullYear()} -  Demo Product for Vuca
                </span>
            </footer>
        </div>
    );
}

export default Authenticated;
