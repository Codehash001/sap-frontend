import {LlamaIndex} from "@/types";
import {CHAT_FILES_MAX_SIZE} from "@/utils/app/const";
import {humanFileSize} from "@/utils/app/files";
import {useTranslation} from 'next-i18next';

interface Props {
    onIndexChange: (index: LlamaIndex) => void;
    handleIsUploading: (isUploading: boolean) => void;
    handleIsUploadSuccess: (isUploadSuccess: boolean) => void;
    handleUploadError: (error: string) => void;
}

export const Upload = ({onIndexChange, handleIsUploading, handleIsUploadSuccess, handleUploadError}: Props) => {

    const { t } = useTranslation('sidebar');

    const handleFile = async (file: File) => {
        if (!validateFile(file)) {
            handleIsUploadSuccess(false);
            return;
        }

        handleIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            await fetch('/api/upload', {
                method: 'POST',
                body: formData
            }).then(res => res.json())
                .then((data: LlamaIndex) => {
                    onIndexChange({indexName: data.indexName, indexType: data.indexType});
                    console.log("import file index json name:", data.indexName);
                });

            handleIsUploading(false);
            handleIsUploadSuccess(true)
        } catch (e) {
            console.error(e);
            handleUploadError((e as Error).message);
            handleIsUploading(false);
            handleIsUploadSuccess(false)
        }
    };

    const validateFile = (file: File) => {
        console.log(`select a file size: ${humanFileSize(file.size)}`);
        console.log(`file max size: ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
        if (CHAT_FILES_MAX_SIZE != 0 && file.size > CHAT_FILES_MAX_SIZE) {
            handleUploadError(`Please select a file smaller than ${humanFileSize(CHAT_FILES_MAX_SIZE)}`);
            return false;
        }
        return true;
    };

    return (
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file"
                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24" className="fill-gray-400">
                    <path d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z"></path>
                </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{t('Click here to upload')}</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('File supported types: TXT, PDF, EPUB, Markdown, Zip...')}</p>
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleFile(e.target.files[0]);
                    }
                }}/>
            </label>
        </div>
    );
}