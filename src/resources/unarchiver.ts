import { Archive } from 'libarchive.js/main.js'
import { FileEntry } from './types'

Archive.init({
  workerUrl: '/vendor/libarchive.js-1.3.0/dist/worker-bundle.js',
})

export async function unarchive(file: File): Promise<FileEntry[]> {
  const out: FileEntry[] = []
  const archive = await Archive.open(file)
  const extracted = await archive.extractFiles()
  const traverse = (tree: any) => {
    for (const key of Object.keys(tree)) {
      if (tree[key] instanceof File) {
        out.push({ name: key, file: tree[key] })
      } else if (tree[key] && typeof tree[key] === 'object') {
        traverse(tree[key])
      }
    }
  }
  traverse(extracted)
  return out
}
