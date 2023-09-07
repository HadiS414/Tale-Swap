"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal, message } from "antd";
import axios, { AxiosError } from "axios";

type DeletePostModalProps = {
    showModal: boolean
    setShowModal: (isOpen: boolean) => void
    postId: string
}

export default function DeletePostModal({ showModal, setShowModal, postId }: DeletePostModalProps) {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutate } = useMutation(
        async (id: string) => await axios.delete(`api/posts/deletePost/${id}`),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["sessionUser"]);
                setShowModal(false);
                messageApi.open({ type: "success", content: "Post has been deleted!", key: "deletePost" })
            },
            onError: (error) => {
                queryClient.invalidateQueries(["sessionUser"]);
                setShowModal(false);
                if (error instanceof AxiosError) {
                    messageApi.open({ type: "error", content: error?.response?.data.message, key: "deletePost" })
                }
            }
        }
    )
    const handleOk = () => {
        mutate(postId);
        messageApi.open({ type: "loading", content: "Deleting post...", key: "deletePost" })
    }
    const handleCancel = () => {
        setShowModal(false);
    }

    return (
        <>
            {contextHolder}
            <Modal
                open={showModal}
                onCancel={handleCancel}
                cancelButtonProps={{ hidden: true }}
                okButtonProps={{ hidden: true }}
            >
                <div className="text-center">
                    <h1 className="text-3xl font-semibold">
                        Delete Post?
                    </h1>
                    <p className="my-3 text-lg"> This action is permanent. </p>
                </div>
                <div className="flex justify-center gap-8 text-lg items-center" onClick={handleCancel}>
                    <div className="underline cursor-pointer">
                        No
                    </div>
                    <div className="bg-red-500 px-3 py-1 rounded-full text-off-white font-thin cursor-pointer" onClick={handleOk}>
                        Delete
                    </div>
                </div>
            </Modal>
        </>
    )
}