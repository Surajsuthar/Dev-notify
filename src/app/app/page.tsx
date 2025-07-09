import { AllRepo } from '@/components/main/all-repo'
import { Issues } from '@/components/main/issues'
import { UserInfo } from '@/components/main/user-info'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function Page() {
    return (
       <main className="w-full p-10 overflow-hidden">
            <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="grid w-1/3 grid-cols-3">
                    <TabsTrigger value="tab1">User</TabsTrigger>
                    <TabsTrigger value="tab2">Repostries</TabsTrigger>
                    <TabsTrigger value="tab3">Issues</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-6">
                    <div className="border-dotted border-white p-4">
                       <UserInfo/>
                    </div>
                </TabsContent>
                <TabsContent value="tab2" className="mt-6">
                    <div className="border-dotted border-white p-4">
                        <AllRepo/>
                    </div>
                </TabsContent>
                <TabsContent value="tab3" className="mt-6">
                    <div className="border-dotted border-white p-4">
                        <Issues/>
                    </div>
                </TabsContent>
            </Tabs>
       </main>
    )
}