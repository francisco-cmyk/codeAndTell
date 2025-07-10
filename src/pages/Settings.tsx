import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../components/ui-lib/Tabs";
import { Account } from "../components/custom-ui/Accounts";
import { Profile } from "../components/custom-ui/Profile";
import { Preferences } from "../components/custom-ui/Preferences";

const tabStyle = `text-zing-600 dark:text-zinc-300 hover:text-zinc-700 dark:hover:text-zinc-400 border-b-2 hover:border-b-black dark:hover:border-b-zinc-300
data-[state=active]:border-b-black data-[state=active]:dark:border-b-zinc-300  data-[state=active]:bg-transparent data-[state=active]:shadow-none font-medium rounded-none shadow-none bg-transparent transition`;

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") ?? "";

  function handleTabChange(value: string) {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: value });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("tab", value);
      setSearchParams(newParams, { replace: true });
    }
  }

  return (
    <div className='w-full h-screen flex flex-col items-center justify-start p-7'>
      <div className='2xl:w-2/3 w-3/4 mb-4'>
        <p className='text-2xl font-semibold text-zinc-500 dark:text-zinc-400'>
          Settings
        </p>
      </div>
      <Tabs
        defaultValue={tab ?? "account"}
        className='2xl:w-2/3 w-3/4 h-3/4 focus:!outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0'
        onValueChange={handleTabChange}
      >
        <TabsList className='flex justify-start gap-x-3 bg-transparent focus:!outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus:!ring-0 focus:ring-offset-0'>
          <TabsTrigger value='account' className={tabStyle}>
            account
          </TabsTrigger>
          <TabsTrigger value='profile' className={tabStyle}>
            profile
          </TabsTrigger>
          <TabsTrigger value='preferences' className={tabStyle}>
            preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value='account' className='h-full w-full overflow-y-auto'>
          <Account />

        </TabsContent>
        <TabsContent value='profile'>
          <Profile />
        </TabsContent>
        <TabsContent value='preferences'>
          <Preferences />
        </TabsContent>
      </Tabs>
    </div>
  );
}
