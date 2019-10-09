import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-jaldee-filter',
    templateUrl: './jaldee-filter.component.html'
})
export class JaldeeFilterComponent implements OnInit {
    @Input() fields: any;

    ngOnInit() {
        console.log('init');
    }

    filterClicked(event) {
        console.log(event);
        if (event.target.selected) {
            event.target.selected = false;
            event.target.classList.remove('button_filter');
        } else {
            event.target.selected = true;
            event.target.classList.add('button_filter');
        }
    }

    // $j(selected_parent.ftbToolBar + " a:not(:selected)").die('click').live('click', function () {
    // 	var curObjName = $j(this).attr('name');
    // 	$j(this).attr('selected', 'selected');
    // 	$j(this).addClass('button_filter');
    // 	$j('#lst' + curObjName).show();
    // 	$j('#txt' + curObjName).show();
    // 	$j('#txt' + curObjName).focus();
    // 	methodInvoker.setReportFilterValues(curObjName);
    // })
    // $j(selected_parent.ftbToolBar + " a[selected]").die('click').live('click', function () {
    // 	var curObjName = $j(this).attr('name');
    // 	$j(this).removeAttr('selected');
    // 	$j(this).removeClass('button_filter');
    // 	$j('#lst' + curObjName).hide();
    // 	$j('#txt' + curObjName).hide();
    // 	$j(selected_parent.filterActionButton).trigger('click');
    // })
    // $j(selected_parent.filterActionButton).die('click').click(function () {
    // 	removeErrors();
    // 	var expList = new ExpressionListDTO();
    // 	$j(selected_parent.ftbToolBar + " a[selected]").each(function () {
    // 		var selName = $j(this).attr('name');
    // 		var selTextValue = $j("#txt" + selName).val();
    // 		var selOperator = $j("#lst" + selName).val();
    // 		var expr = new ExpressionDTO(selName, selTextValue, selOperator);
    // 		expList.add(expr);
    // 	});
    // 	var discountTableNavigator = selected_parent.getDiscountTableNavigator();
    // 	discountTableNavigator.setExp(expList);
    // 	discountTableNavigator.list();
    // });
    // $j(selected_parent.ftbToolBar + ' input[type="text"]').die('keypress').live("keypress", function (e) {
    // 	if (e.keyCode == 13)
    // 		$j(selected_parent.filterActionButton).trigger('click');
    // });

}
