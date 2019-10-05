export class ServiceModel {
    public id: string;
    public name: string;
    public description: string;
    public serviceDuration: number;
    public totalAmount: number;
    public isPrePayment: boolean;
    public taxable: boolean;
    public notification: boolean;
    public notificationType: string;
    public department: number;
    public bType: string;

    constructor(name: string, desc: string, duration: number, notificationStatus: boolean, amount?: number, prepayment?: boolean, taxable?: boolean, notificationType?: string, department?: number) {
        this.name = name;
        this.description = desc;
        this.serviceDuration = duration;
        this.totalAmount = amount;
        this.isPrePayment = prepayment;
        this.taxable = taxable;
        this.notification = notificationStatus;
        this.notificationType = notificationType;
        this.department = department;
    }

}
