function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface TabsInterface {
  name: string;
  icon?: React.ForwardRefExoticComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
      titleId?: string | undefined;
    }
  >;
}

export default function TabsNavigator({
  tabs,
  selected,
  setSelected,
}: {
  tabs: TabsInterface[];
  selected: string;
  setSelected: (name: string) => void;
}) {
  return (
    <div className=" bg-slate-50">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-slate-500 focus:outline-none focus:ring-slate-500 sm:text-sm"
          defaultValue={tabs[0].name}
          onChange={(e) => setSelected(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-300">
          <nav className="-mb-px flex gap-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                className={classNames(
                  tab.name === selected
                    ? "border-slate-500 text-slate-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 pt-1 mb-2 px-1 text-sm font-medium cursor-pointer"
                )}
                onClick={() => setSelected(tab.name)}
                aria-current={tab.name === selected ? "page" : undefined}
              >
                {tab.icon ? (
                  <div className="flex items-center">
                    {
                      <tab.icon
                        className={
                          "text-gray-400 group-hover:text-gray-500 -ml-1 mr-1 h-4 w-4 flex-shrink-0"
                        }
                        aria-hidden="true"
                      />
                    }{" "}
                    <span>{tab.name}</span>
                  </div>
                ) : (
                  <>{tab.name}</>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
