"""shadcn/ui + Radix adoption: keep business layouts from reintroducing native-only UI."""
import json
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[2]

class ShadcnMigrationTests(unittest.TestCase):
    def test_both_web_frontends_declare_radix_primitives(self):
        required={
            '@radix-ui/react-dialog','@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select','@radix-ui/react-tabs',
            '@radix-ui/react-switch','@radix-ui/react-label',
            '@radix-ui/react-tooltip','@radix-ui/react-alert-dialog',
        }
        for project in ('admin','portal'):
            manifest=json.loads((ROOT/f'frontend/{project}/package.json').read_text('utf-8'))
            self.assertTrue(required.issubset(manifest['dependencies']),project)
            self.assertIn('class-variance-authority',manifest['dependencies'])
            self.assertIn('@radix-ui/react-slot',manifest['dependencies'])

    def test_web_ui_components_use_shadcn_composition(self):
        radix_modules={
            'dialog':'@radix-ui/react-dialog','sheet':'@radix-ui/react-dialog',
            'dropdown-menu':'@radix-ui/react-dropdown-menu',
            'select':'@radix-ui/react-select','tabs':'@radix-ui/react-tabs',
            'switch':'@radix-ui/react-switch','tooltip':'@radix-ui/react-tooltip',
            'label':'@radix-ui/react-label','alert-dialog':'@radix-ui/react-alert-dialog'
        }
        for project in ('admin','portal'):
            directory=ROOT/f'frontend/{project}/src/components/ui'
            for name, dependency in radix_modules.items():
                contents=(directory/f'{name}.tsx').read_text('utf-8')
                self.assertIn(dependency,contents,(project,name))
            for name in ('button','card','badge','input','textarea','skeleton','table','empty'):
                self.assertTrue((directory/f'{name}.tsx').is_file(),(project,name))
            self.assertIn('class-variance-authority',(directory/'button.tsx').read_text('utf-8'))

    def test_native_dialog_and_handwritten_dropdowns_not_used_in_pages(self):
        for project in ('admin','portal'):
            src=ROOT/f'frontend/{project}/src'
            for tsx in src.rglob('*.tsx'):
                text=tsx.read_text('utf-8')
                self.assertNotIn('<dialog',text,str(tsx))
                self.assertNotIn('.showModal(',text,str(tsx))
        portal=(ROOT/'frontend/portal/src/app/page.tsx').read_text('utf-8')
        self.assertNotIn('portal-button',portal)
        self.assertIn('<Button asChild',portal)
        self.assertIn('<Card',portal)

    def test_admin_shell_and_table_use_established_components(self):
        directory=ROOT/'frontend/admin/src'
        shell=(directory/'components/layout/admin-shell.tsx').read_text('utf-8')
        self.assertIn('SidebarProvider',shell)
        self.assertIn('SidebarMenuButton',shell)
        self.assertIn('Sheet', (directory/'components/ui/sidebar.tsx').read_text('utf-8'))
        table=(directory/'components/ui/data-table.tsx').read_text('utf-8')
        self.assertIn('@tanstack/react-table',table)
        self.assertIn("from './table'",table)
        lab=(directory/'features/components-demo.tsx').read_text('utf-8')
        for comp in ('DialogContent','AlertDialogContent','SelectTrigger','TabsTrigger','Switch','TooltipContent'):
            self.assertIn(comp,lab)

    def test_portal_mobile_nav_is_radix_sheet(self):
        header=(ROOT/'frontend/portal/src/components/layout/site-header.tsx').read_text('utf-8')
        self.assertIn('SheetTrigger',header)
        self.assertIn('SheetClose',header)
        self.assertIn('NavigationMenuLink',header)
        self.assertIn('<Button',header)

if __name__=='__main__':
    unittest.main()
