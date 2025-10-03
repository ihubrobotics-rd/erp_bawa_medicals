"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Box,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  ListTree,
  ChevronRight,
  CornerDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  useModules,
  useSubmodules,
  useFunctionalities,
} from "@/hooks/useModules";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ModuleForm } from "./module-form";
import { SubmoduleForm } from "./submodule-form";
import { FunctionalityForm } from "./functionality-form";
import type { Module, Submodule, Functionality } from "@/types/modules";
import { useDebounce } from "@/hooks/useDebounce";

// Helper Component for rendering the nested list of functionalities.
function FunctionalityList({
  submodule,
  onEdit,
}: {
  submodule: Submodule;
  onEdit: (functionality: Functionality) => void;
}) {
  const { functionalitiesQuery, deactivateFunctionalityMutation } =
    useFunctionalities(submodule.id);
  const [funcToDeactivate, setFuncToDeactivate] =
    useState<Functionality | null>(null);

  const handleDeactivate = async () => {
    if (funcToDeactivate) {
      await deactivateFunctionalityMutation.mutateAsync(funcToDeactivate.id);
      setFuncToDeactivate(null);
    }
  };

  if (functionalitiesQuery.isLoading) {
    return (
      <p className="p-4 text-sm text-center text-muted-foreground">
        Loading functionalities...
      </p>
    );
  }

  return (
    <div>
      <div className="pl-12 pr-4 py-2 bg-muted/50">
        {functionalitiesQuery.data?.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No functionalities found for this submodule.
          </p>
        ) : (
          functionalitiesQuery.data?.map((func) => (
            <div
              key={func.id}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{func.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {func.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={func.is_active ? "outline" : "secondary"}>
                  {func.is_active ? "Active" : "Inactive"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEdit(func)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={() => setFuncToDeactivate(func)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <AlertDialog
        open={!!funcToDeactivate}
        onOpenChange={() => setFuncToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the functionality "{funcToDeactivate?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deactivateFunctionalityMutation.isPending}
            >
              {deactivateFunctionalityMutation.isPending
                ? "Deactivating..."
                : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function ModuleManagement() {
  // State for Modules
  const [moduleSearch, setModuleSearch] = useState("");
  const debouncedModuleSearch = useDebounce(moduleSearch, 500);
  const { modulesQuery, deactivateModuleMutation } = useModules(
    debouncedModuleSearch
  );
  const [isModuleFormOpen, setIsModuleFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [moduleToDeactivate, setModuleToDeactivate] = useState<Module | null>(
    null
  );

  // State for Submodules
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [submoduleSearch, setSubmoduleSearch] = useState("");
  const debouncedSubmoduleSearch = useDebounce(submoduleSearch, 500);
  const { submodulesQuery, deactivateSubmoduleMutation } = useSubmodules(
    selectedModuleId,
    debouncedSubmoduleSearch
  );
  const [isSubmoduleFormOpen, setIsSubmoduleFormOpen] = useState(false);
  const [editingSubmodule, setEditingSubmodule] = useState<Submodule | null>(
    null
  );
  const [submoduleToDeactivate, setSubmoduleToDeactivate] =
    useState<Submodule | null>(null);

  // State for Functionalities
  const [isFunctionalityFormOpen, setIsFunctionalityFormOpen] = useState(false);
  const [editingFunctionality, setEditingFunctionality] =
    useState<Functionality | null>(null);
  const [targetSubmoduleId, setTargetSubmoduleId] = useState<number | null>(
    null
  );

  const selectedModule = modulesQuery.data?.find(
    (m) => m.id === selectedModuleId
  );

  // --- Handlers for Modules ---
  const handleAddModule = () => {
    setEditingModule(null);
    setIsModuleFormOpen(true);
  };
  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsModuleFormOpen(true);
  };
  const handleDeactivateModule = async () => {
    if (moduleToDeactivate) {
      await deactivateModuleMutation.mutateAsync(moduleToDeactivate.id);
      setModuleToDeactivate(null);
    }
  };

  // --- Handlers for Submodules ---
  const handleAddSubmodule = () => {
    setEditingSubmodule(null);
    setIsSubmoduleFormOpen(true);
  };
  const handleEditSubmodule = (submodule: Submodule) => {
    setEditingSubmodule(submodule);
    setIsSubmoduleFormOpen(true);
  };
  const handleDeactivateSubmodule = async () => {
    if (submoduleToDeactivate) {
      await deactivateSubmoduleMutation.mutateAsync(submoduleToDeactivate.id);
      setSubmoduleToDeactivate(null);
    }
  };

  // --- Handlers for Functionalities ---
  const handleAddFunctionality = (submodule: Submodule) => {
    setEditingFunctionality(null);
    setTargetSubmoduleId(submodule.id);
    setIsFunctionalityFormOpen(true);
  };
  const handleEditFunctionality = (functionality: Functionality) => {
    setEditingFunctionality(functionality);
    setTargetSubmoduleId(functionality.submodule);
    setIsFunctionalityFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Module & Feature Management</h3>
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

        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Modules</CardTitle>
              <CardDescription>
                Create, edit, and manage top-level system modules.
              </CardDescription>
              <div className="flex justify-between items-center pt-2">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search modules..."
                    className="pl-8"
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddModule}>
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
                  {modulesQuery.isLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Loading modules...
                      </TableCell>
                    </TableRow>
                  )}
                  {modulesQuery.data?.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell className="font-medium">
                        {module.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {module.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={module.is_active ? "default" : "secondary"}
                        >
                          {module.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEditModule(module)}
                            >
                              <Edit className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setModuleToDeactivate(module)}
                            >
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

        <TabsContent value="submodules">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle>Select a Module</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {modulesQuery.isLoading && (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                )}
                {modulesQuery.data?.map((module) => (
                  <Button
                    key={module.id}
                    variant={
                      selectedModuleId === module.id ? "secondary" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedModuleId(module.id)}
                  >
                    <Box className="w-4 h-4 mr-2" /> {module.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  Submodules for:{" "}
                  <span className="text-primary">
                    {selectedModule?.name || "..."}
                  </span>
                </CardTitle>
                <CardDescription>
                  {selectedModuleId
                    ? `Manage submodules and their functions within the ${selectedModule?.name} module.`
                    : "Please select a module from the left."}
                </CardDescription>
                {selectedModuleId && (
                  <div className="flex justify-between items-center pt-2">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search submodules..."
                        className="pl-8"
                        value={submoduleSearch}
                        onChange={(e) => setSubmoduleSearch(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddSubmodule}>
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
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    {submodulesQuery.isLoading && (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Loading submodules...
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}

                    {submodulesQuery.data?.map((submodule) => (
                      <Collapsible asChild key={submodule.id}>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 data-[state=open]:bg-accent"
                                >
                                  <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                                </Button>
                              </CollapsibleTrigger>
                            </TableCell>
                            <TableCell className="font-medium">
                              {submodule.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {submodule.description}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  submodule.is_active ? "default" : "secondary"
                                }
                              >
                                {submodule.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleAddFunctionality(submodule)
                                    }
                                  >
                                    <Plus className="w-4 h-4 mr-2" /> Add
                                    Functionality
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditSubmodule(submodule)
                                    }
                                  >
                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() =>
                                      setSubmoduleToDeactivate(submodule)
                                    }
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />{" "}
                                    Deactivate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>

                          <CollapsibleContent asChild>
                            <tr className="p-0">
                              <td colSpan={5} className="p-0">
                                <FunctionalityList
                                  submodule={submodule}
                                  onEdit={handleEditFunctionality}
                                />
                              </td>
                            </tr>
                          </CollapsibleContent>
                        </TableBody>
                      </Collapsible>
                    ))}
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

      {isModuleFormOpen && (
        <ModuleForm
          module={editingModule}
          onClose={() => setIsModuleFormOpen(false)}
        />
      )}

      {isSubmoduleFormOpen && selectedModuleId && (
        <SubmoduleForm
          submodule={editingSubmodule}
          moduleId={selectedModuleId}
          onClose={() => setIsSubmoduleFormOpen(false)}
        />
      )}

      {isFunctionalityFormOpen && targetSubmoduleId && (
        <FunctionalityForm
          functionality={editingFunctionality}
          submoduleId={targetSubmoduleId}
          onClose={() => setIsFunctionalityFormOpen(false)}
        />
      )}

      <AlertDialog
        open={!!moduleToDeactivate}
        onOpenChange={() => setModuleToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the module "{moduleToDeactivate?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateModule}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deactivateModuleMutation.isPending}
            >
              {deactivateModuleMutation.isPending
                ? "Deactivating..."
                : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!submoduleToDeactivate}
        onOpenChange={() => setSubmoduleToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will deactivate the submodule "{submoduleToDeactivate?.name}
              ".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateSubmodule}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deactivateSubmoduleMutation.isPending}
            >
              {deactivateSubmoduleMutation.isPending
                ? "Deactivating..."
                : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
