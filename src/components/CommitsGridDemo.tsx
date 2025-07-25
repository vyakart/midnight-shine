import * as React from "react"
import { CommitsGrid } from "./ui/commits-grid"

const CommitsGridDemo = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full p-8 bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">GitHub Commits Grid</h1>
                    <p className="text-slate-600 dark:text-slate-400">Interactive commit grid visualization</p>
                </div>
                <CommitsGrid text="21ST" />
                <div className="text-center max-w-md">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        This component simulates GitHub's contribution graph with animated highlighting effects.
                    </p>
                </div>
            </div>
        </div>
    )
}

export { CommitsGridDemo }