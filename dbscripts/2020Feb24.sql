
alter table VehicleRequestedServices Add RequestedBy INT NULL;

update VehicleRequestedServices SET RequestedBy = UserId;

