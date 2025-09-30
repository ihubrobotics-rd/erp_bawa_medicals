"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Box,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ListTree,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useModules, useSubmodules } from "@/hooks/useModules"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// TODO: Move forms to their own files (e.g., ModuleForm.tsx)

export function ModuleManagement() {
  const [moduleSearch, setModuleSearch] = useState("")
  const { modulesQuery } = useModules(moduleSearch)

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null)
  const [submoduleSearch, setSubmoduleSearch] = useState("")
  const { submodulesQuery } = useSubmodules(selectedModuleId, submoduleSearch)

  const selectedModule = modulesQuery.data?.find((m) => m.id === selectedModuleId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Module & Submodule Management</h3>
        {/* Add button can go here if needed, or within tabs */}
      </div>

      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">
            <LayoutDashboard className="w-4 h-4 mr-2" /> Modules
          </TabsTrigger>
          <TabsTrigger value="submodules">
            <ListTree className="w-4 h-4 mr-2" /> Submodules
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: MODULES MANAGEMENT */}
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Modules</CardTitle>
              <CardDescription>Create, edit, and manage system modules.</CardDescription>
              <div className="flex justify-between items-center pt-2">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search modules..." className="pl-8" value={moduleSearch} onChange={e => setModuleSearch(e.target.value)} />
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" /> Add Module
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modulesQuery.isLoading && <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>}
                  {modulesQuery.data?.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">{module.name}</TableCell>
                      <TableCell className="text-muted-foreground">{module.description}</TableCell>
                      <TableCell>
                        <Badge variant={module.is_active ? "default" : "secondary"}>
                          {module.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" /> Deactivate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SUBMODULES MANAGEMENT (MASTER-DETAIL VIEW) */}
        <TabsContent value="submodules">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel: Module List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select a Module</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modulesQuery.data?.map((module) => (
                   <Button
                    key={module.id}
                    variant={selectedModuleId === module.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedModuleId(module.id)}
                  >
                    <Box className="w-4 h-4 mr-2" /> {module.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Right Panel: Submodules for Selected Module */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Submodules for: <span className="text-primary">{selectedModule?.name || '...'}</span>
                </CardTitle>
                <CardDescription>
                  {selectedModuleId ? `Manage submodules within the ${selectedModule?.name} module.` : 'Please select a module from the left.'}
                </CardDescription>
                {selectedModuleId && (
                   <div className="flex justify-between items-center pt-2">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search submodules..." className="pl-8" value={submoduleSearch} onChange={e => setSubmoduleSearch(e.target.value)} />
                    </div>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" /> Add Submodule
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                 {selectedModuleId ? (
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submodulesQuery.isLoading && <TableRow><TableCell colSpan={3} className="text-center">Loading...</TableCell></TableRow>}
                      {submodulesQuery.data?.map((submodule) => (
                        <TableRow key={submodule.id}>
                          <TableCell className="font-medium">{submodule.name}</TableCell>
                          <TableCell className="text-muted-foreground">{submodule.description}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem><Plus className="w-4 h-4 mr-2" /> Add Functionality</DropdownMenuItem>
                                <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Deactivate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                   </Table>
                 ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                        <p>Select a module to see its submodules.</p>
                    </div>
                 )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}