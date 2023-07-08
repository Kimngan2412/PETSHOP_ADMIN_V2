
import { WCAutoCompleteOption } from 'src/components/auto-complete';

export const defaultOptonValue: WCAutoCompleteOption = { label: 'Choose', value: 'NONE' }
export const testOptions: WCAutoCompleteOption[] = [
    { label: 'choose 1', value: 'PENDING' },
    { label: 'choose 2', value: 'APPROVED' }
]
export const LIMIT_PAGE = 10
export const DEFAULT_PAGE = 1

export const renderStatusString = (status: number) => {
    return status == 1 ? ENUM_STATUS.ACTIVE : ENUM_STATUS.DEACTIVE
}

export enum ENUM_STATUS {
    ACTIVE = "Active",
    DEACTIVE = "Deactive"
}

export const SAVE_SUCCESS_MESSAGE = 'Process has been successfully!'
export const ERROR_MESSAGE = 'Something went wrong, please try again!'