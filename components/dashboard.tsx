'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Upload, Download, LogOut, Plus, FolderOpen } from 'lucide-react'

interface Category {
  id: string
  name: string
}

interface File {
  id: string
  filename: string
  createdAt: string
  category: Category
}

export function Dashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchFiles()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id)
      }
    }
  }

  const fetchFiles = async () => {
    const res = await fetch('/api/files')
    if (res.ok) {
      const data = await res.json()
      setFiles(data)
    }
  }

  const createCategory = async () => {
    if (!newCategoryName.trim()) return

    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName }),
    })

    if (res.ok) {
      const category = await res.json()
      setCategories([...categories, category])
      setNewCategoryName('')
      toast({ title: 'Categoria criada!' })
    } else {
      toast({ title: 'Erro ao criar categoria', variant: 'destructive' })
    }
  }

  const handleUpload = async () => {
    if (!uploadFile || !selectedCategory) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('categoryId', selectedCategory)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      fetchFiles()
      setUploadFile(null)
      toast({ title: 'Arquivo enviado!' })
    } else {
      toast({ title: 'Erro no upload', variant: 'destructive' })
    }
    setIsUploading(false)
  }

  const downloadFile = async (fileId: string) => {
    const res = await fetch(`/api/files/${fileId}/download`)
    if (res.ok) {
      const { url } = await res.json()
      window.open(url, '_blank')
    } else {
      toast({ title: 'Erro no download', variant: 'destructive' })
    }
  }

  const filteredFiles = files.filter(file => 
    selectedCategory ? file.category.id === selectedCategory : true
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Caixa-Preta</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Categorias</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova Categoria</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Nome da categoria"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button onClick={createCategory} className="w-full">
                      Criar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent/50'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 inline mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="flex items-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload de Arquivo</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <Button 
                      onClick={handleUpload} 
                      disabled={!uploadFile || !selectedCategory || isUploading}
                      className="w-full"
                    >
                      {isUploading ? 'Enviando...' : 'Enviar'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Files Table */}
            <div className="border border-border rounded-lg">
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">Arquivos</h3>
              </div>
              <div className="divide-y divide-border">
                {filteredFiles.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum arquivo encontrado
                  </div>
                ) : (
                  filteredFiles.map((file) => (
                    <div key={file.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{file.filename}</div>
                        <div className="text-sm text-muted-foreground">
                          {file.category.name} • {new Date(file.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFile(file.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}